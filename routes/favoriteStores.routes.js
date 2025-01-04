const express = require('express');
const router = express.Router();
const FavoriteStoreController = require('../controllers/favoriteStores.controller');
const authenticateToken = require('../middleware/authMiddleware');

router.put('/:storeId', authenticateToken, FavoriteStoreController.addFavoriteStore);
router.delete('/:storeId', authenticateToken, FavoriteStoreController.removeFavoriteStore);
router.get('/checkIfFav/:storeId', authenticateToken, FavoriteStoreController.checkIfFavorite);

router.get('/get', authenticateToken, FavoriteStoreController.getFavoriteStores);
router.get('/getStoresProducts', authenticateToken, FavoriteStoreController.getRandomProductsFromFavoriteStores);

module.exports = router;
