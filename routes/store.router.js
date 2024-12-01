const router = require('express').Router();
const StoreController = require('../controllers/store.controller');
const ProductController = require('../controllers/product.controller');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/registration', StoreController.register);

// Route to get products by store ID
router.get('/getAllProducts', authenticateToken, ProductController.getProductsByStoreId);

module.exports = router;