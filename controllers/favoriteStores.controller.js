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
        // Adjust the service function to return only storeId
        const favorites = await FavoriteStoreServices.getFavoriteStoresByUser(userId);

        // Map over the favorites and return only storeId
        const storeIds = favorites.map(favorite => favorite.storeId);
        console.log('inside favorite stores fetch');
        console.log(storeIds);
        res.status(200).json({ success: true, data: storeIds });
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
exports.getProductsFromFavoriteStores = async (req, res) => {
    try {
        const userId = req.user._id; // Extracted from token
        const products = await FavoriteStoreServices.getProductsFromFavoriteStores(userId);

        res.status(200).json({ success: true, products });
    } catch (err) {
        console.error('Error fetching products from favorite stores:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch products from favorite stores.' });
    }
};
exports.getRandomProductsFromFavoriteStores = async (req, res) => {
    try {
        const userId = req.user._id; // Extracted from token
        const products = await FavoriteStoreServices.getRandomProductsFromFavoriteStores(userId);

        res.status(200).json({ success: true, products });
    } catch (err) {
        console.error('Error fetching random products from favorite stores:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch products from favorite stores.' });
    }
};


