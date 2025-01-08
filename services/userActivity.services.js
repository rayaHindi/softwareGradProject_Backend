const UserActivityModel = require('../model/userActivity.model');

class UserActivityService {
    static async getActivity(userId) {
        try {
            return await UserActivityModel.findOne({ userId })
                .populate('lastVisitedCategory', 'name description')
                .populate('lastVisitedProducts.productId', 'name price')
                .populate('viewedStores.storeId', 'storeName logo');
        } catch (error) {
            console.error('Error fetching user activity:', error);
            throw new Error('Failed to fetch user activity.');
        }
    }

    static async updateLastVisitedCategory(userId, categoryId) {
        try {
            await UserActivityModel.findOneAndUpdate(
                { userId },
                { $set: { lastVisitedCategory: categoryId, lastInteractionDate: new Date() } },
                { upsert: true }
            );
        } catch (error) {
            console.error('Error updating last visited category:', error);
            throw new Error('Failed to update last visited category.');
        }
    }
    static async addProductVisit(userId, productId) {
        try {
            const productVisit = { productId, visitedAt: new Date() };
            if(!productId){
                throw new Error('productId must be provided.');
            }
    
            // Update the `visitedAt` timestamp if the product already exists
            const result = await UserActivityModel.findOneAndUpdate(
                { userId, 'lastVisitedProducts.productId': productId },
                {
                    $set: {
                        'lastVisitedProducts.$.visitedAt': new Date(), // Update visitedAt for existing product
                        lastInteractionDate: new Date(),
                    },
                },
                { upsert: false, new: true } // Do not create a new record here
            );
    
            // If the product does not already exist in the array, add it
            if (!result) {
                await UserActivityModel.findOneAndUpdate(
                    { userId },
                    {
                        $push: {
                            lastVisitedProducts: {
                                $each: [productVisit],
                                $slice: -10, // Keep only the last 10 entries
                            },
                        },
                        $set: { lastInteractionDate: new Date() },
                    },
                    { upsert: true, new: true }
                );
            }
        } catch (error) {
            console.error('Error recording product visit:', error);
            throw new Error('Failed to record product visit.');
        }
    }
    
    
    static async addSearchHistory(userId, query, interactedProductId, interactedStoreId) {
        try {
            const searchEntry = {
                query,
                searchedAt: new Date(),
                interactedProduct: interactedProductId || null,
                interactedStore: interactedStoreId || null,
            };
    
            const recentSearchExists = await UserActivityModel.findOne({
                userId,
                'searchHistory.query': query,
            });
    
            if (recentSearchExists) {
                // Update the timestamp of the existing search entry
                await UserActivityModel.findOneAndUpdate(
                    { userId, 'searchHistory.query': query },
                    {
                        $set: {
                            'searchHistory.$.searchedAt': new Date(),
                            lastInteractionDate: new Date(),
                        },
                    }
                );
            } else {
                // Add the new search entry
                await UserActivityModel.findOneAndUpdate(
                    { userId },
                    {
                        $push: { searchHistory: { $each: [searchEntry], $slice: -10 } },
                        $set: { lastInteractionDate: new Date() },
                    },
                    { upsert: true }
                );
            }
        } catch (error) {
            console.error('Error adding search history:', error);
            throw new Error('Failed to add search history.');
        }
    }
    
    
    

    static async addStoreView(userId, storeId) {
        try {
            const storeView = { storeId, viewedAt: new Date() };
    
            // Update the `viewedAt` timestamp if the store already exists
            const result = await UserActivityModel.findOneAndUpdate(
                { userId, 'viewedStores.storeId': storeId },
                {
                    $set: {
                        'viewedStores.$.viewedAt': new Date(), // Update viewedAt for existing store
                        lastInteractionDate: new Date(),
                    },
                },
                { upsert: false, new: true } // Do not create a new record here
            );
    
            // If the store does not already exist in the array, add it
            if (!result) {
                await UserActivityModel.findOneAndUpdate(
                    { userId },
                    {
                        $push: {
                            viewedStores: {
                                $each: [storeView],
                                $slice: -10, // Keep only the last 10 entries
                            },
                        },
                        $set: { lastInteractionDate: new Date() },
                    },
                    { upsert: true, new: true }
                );
            }
        } catch (error) {
            console.error('Error recording store view:', error);
            throw new Error('Failed to record store view.');
        }
    }
    
    
    
}

module.exports = UserActivityService;
