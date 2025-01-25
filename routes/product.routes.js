//product.route.js

const router = require("express").Router();
const ProductController = require('../controllers/product.controller.js');
const authenticateToken = require('../middleware/authMiddleware');

router.post("/addNewPastryProduct", authenticateToken, ProductController.addNewProduct);
router.get("/getAllProducts", ProductController.getAllProducts);
router.put('/updateProductInfo', authenticateToken, ProductController.updateProduct);
router.delete('/deleteProduct/:productId', authenticateToken, ProductController.deleteProduct);
router.put('/reduce-quantity/:productId', authenticateToken, ProductController.reduceQuantity);
router.get('/getMostSearched', ProductController.getMostSearched);
router.get('/incrementSearchCount', ProductController.incrementSearchCount);
router.post('/rateProduct', authenticateToken, ProductController.rateProduct);

router.post('/saleUpdate', ProductController.updateProductsBatch);

//router.get('/:storeId/insights', ProductController.getStoreInsights);

/*
router.get('/products', productController.getAllProductsController);
router.get('/products/:id', productController.getProductByIdController);
router.put('/products/:id', productController.updateProductController);
router.delete('/products/:id', productController.deleteProductController);
*/
module.exports = router;

