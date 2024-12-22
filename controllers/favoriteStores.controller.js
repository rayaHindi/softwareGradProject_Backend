const FavoriteStoreServices = require('../services/favoriteStores.services');

// Add a store to user's favorites
exports.addFavoriteStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const userId = req.user._id; // Assume user ID is extracted from the token

        const result = await FavoriteStoreServices.addFavoriteStore(userId, storeId);
        if (result) {
            return res.status(200).json({ success: true, message: 'Store added to favorites.' });
        }
        res.status(400).json({ success: false, message: 'Store is already in favorites.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Remove a store from user's favorites
exports.removeFavoriteStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const userId = req.user._id; // Assume user ID is extracted from the token

        const result = await FavoriteStoreServices.removeFavoriteStore(userId, storeId);
        if (result) {
            return res.status(200).json({ success: true, message: 'Store removed from favorites.' });
        }
        res.status(400).json({ success: false, message: 'Store not found in favorites.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Get all favorite stores for a user
exports.getFavoriteStores = async (req, res) => {
    try {
        const userId = req.user._id; // Assume user ID is extracted from the token
        const favorites = await FavoriteStoreServices.getFavoriteStoresByUser(userId);

        res.status(200).json({ success: true, data: favorites });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.checkIfFavorite = async (req, res) => {
    try {
        const { storeId } = req.params;
        const userId = req.user._id; // Extracted from token via middleware

        const isFavorite = await FavoriteStoreServices.isFavoriteStore(userId, storeId);

        return res.status(200).json({ success: true, isFavorite });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};