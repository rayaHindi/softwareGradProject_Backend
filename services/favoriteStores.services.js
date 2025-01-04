const FavoriteStoreModel = require("../model/favoriteStores.model");
const ProductModel = require("../model/product.model");
class FavoriteStoreServices {
    // Add a favorite store for a user
    static async addFavoriteStore(userId, storeId) {
        try {
            // Check if the favorite store already exists
            const existingFavorite = await FavoriteStoreModel.findOne({ userId, storeId });
            if (existingFavorite) {
                return null; // Store is already in favorites
            }

            // Add the favorite store
            const favoriteStore = new FavoriteStoreModel({ userId, storeId });
            return await favoriteStore.save(); // Save the document and return it
        } catch (error) {
            throw new Error("Error adding favorite store: " + error.message);
        }
    }

    // Remove a favorite store for a user
    static async removeFavoriteStore(userId, storeId) {
        try {
            // Remove the favorite store
            const result = await FavoriteStoreModel.findOneAndDelete({ userId, storeId });
            return result; // Returns the removed document, or null if not found
        } catch (error) {
            throw new Error("Error removing favorite store: " + error.message);
        }
    }

    // Get all favorite stores for a specific user
    static async getFavoriteStoresByUser(userId) {
        try {
            return await FavoriteStoreModel.find({ userId }).populate('storeId'); // Populate store details
        } catch (error) {
            throw new Error("Error fetching favorite stores: " + error.message);
        }
    }

    // Check if a store is favorited by a user
    static async isFavoriteStore(userId, storeId) {
        try {
            const favoriteStore = await FavoriteStoreModel.findOne({ userId, storeId });
            return !!favoriteStore; // Return true if the store exists in favorites
        } catch (error) {
            throw new Error("Error checking favorite store: " + error.message);
        }
    }
    static async isFavoriteStore(userId, storeId) {
        try {
            const favoriteStore = await FavoriteStoreModel.findOne({ userId, storeId });
            return !!favoriteStore; // Return true if the store exists in favorites, false otherwise
        } catch (error) {
            throw new Error("Error checking favorite store: " + error.message);
        }
    }
    static async getProductsFromFavoriteStores(userId) {
        try {
            // Fetch favorite stores for the user and populate store details
            const favoriteStores = await FavoriteStoreModel.find({ userId })
                .populate({
                    path: 'storeId', // Populate the storeId field
                    select: 'storeName logo', // Include only storeName and logo
                });
    
            // Extract store IDs from the populated favoriteStores
            const storeIds = favoriteStores.map(fav => fav.storeId._id);
    
            // Fetch products from these favorite stores and populate store details for each product
            const products = await ProductModel.find({ store: { $in: storeIds } })
                .populate({
                    path: 'store', // Populate the store field within each product
                    select: 'storeName logo', // Include only storeName and logo
                });
    
            return products; // Return the list of products with populated store details
        } catch (error) {
            throw new Error('Error fetching products from favorite stores: ' + error.message);
        }
    }
    
    static async getRandomProductsFromFavoriteStores(userId) {
        try {
            // Find favorite stores for the user and populate store details
            const favoriteStores = await FavoriteStoreModel.find({ userId }).populate({
                path: 'storeId',
                select: 'storeName logo', // Fetch only storeName and logo fields
            });
    
            if (!favoriteStores.length) {
                return []; // No favorite stores
            }
    
            // Extract store IDs from favoriteStores
            const storeIds = favoriteStores.map(fav => fav.storeId._id);
    
            // Fetch products from these stores and populate their store field
            const allProducts = await ProductModel.find({ store: { $in: storeIds } }).populate({
                path: 'store',
                select: 'storeName logo', // Populate store details for each product
            });
    
            if (!allProducts.length) {
                return []; // No products in favorite stores
            }
    
            // Shuffle the products and pick a random subset
            const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());
            const randomProducts = shuffledProducts.slice(0, 10); // Adjust the number as needed
    
            return randomProducts;
        } catch (error) {
            throw new Error('Error fetching random products from favorite stores: ' + error.message);
        }
    }
    
    
}

module.exports = FavoriteStoreServices;
