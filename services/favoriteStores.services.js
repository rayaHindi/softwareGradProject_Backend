const FavoriteStoreModel = require("../model/favoriteStores.model");

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
}

module.exports = FavoriteStoreServices;
