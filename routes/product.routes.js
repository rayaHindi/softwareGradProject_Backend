//product.route.js

const router = require("express").Router();
const ProductController = require('../controllers/product.controller.js');

router.post("/addNewPastryProduct", ProductController.addNewProduct);
router.get("/getAllProducts", ProductController.getAllProducts);

/*
router.get('/products', productController.getAllProductsController);
router.get('/products/:id', productController.getProductByIdController);
router.put('/products/:id', productController.updateProductController);
router.delete('/products/:id', productController.deleteProductController);
*/
module.exports = router;