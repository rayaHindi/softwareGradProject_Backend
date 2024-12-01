const router = require('express').Router();
const StoreController = require('../controllers/store.controller');
const ProductController = require('../controllers/product.controller');

router.post('/registration', StoreController.register);

// Route to get products by store ID
router.get('/getAllProducts/:storeId', ProductController.getProductsByStoreId);

module.exports = router;