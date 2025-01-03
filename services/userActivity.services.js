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
                { upsert: true }
            );
        } catch (error) {
            console.error('Error recording product visit:', error);
            throw new Error('Failed to record product visit.');
        }
    }
    
    static async addSearchHistory(userId, query, interactedProductIds, interactedStoreIds) {
        try {
            const searchEntry = {
                query,
                searchedAt: new Date(),
                interactedProducts: interactedProductIds,
                interactedStores: interactedStoreIds,
            };
    
            // Update or create the user activity record
            await UserActivityModel.findOneAndUpdate(
                { userId },
                {
                    $push: { searchHistory: searchEntry }, // Add the new search entry
                    $set: { lastInteractionDate: new Date() }, // Update last interaction date
                },
                { upsert: true, new: true } // Create the record if it doesn't exist and return the updated document
            );
        } catch (error) {
            console.error('Error adding search history:', error);
            throw new Error('Failed to add search history.');
        }
    }
    

    static async addStoreView(userId, storeId) {
        try {
            const storeView = { storeId, viewedAt: new Date() };
    
            await UserActivityModel.findOneAndUpdate(
                { userId },
                {
                    $push: {
                        viewedStores: {
                            $each: [storeView],
                            $slice: -5, // Keep only the last 5 entries
                        },
                    },
                    $set: { lastInteractionDate: new Date() },
                },
                { upsert: true }
            );
        } catch (error) {
            console.error('Error recording store view:', error);
            throw new Error('Failed to record store view.');
        }
    }
    
}

module.exports = UserActivityService;
