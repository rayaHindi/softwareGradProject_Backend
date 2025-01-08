const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/addNewCartItem', authMiddleware, cartController.addItem);
router.get('/getCartData', authMiddleware, cartController.getCart);
router.put('/updateCartItem', authMiddleware, cartController.updateCartItem);
//router.delete('/remove/:productId', authMiddleware, cartController.removeOrderedItems);
router.delete('/removeCartItems', authMiddleware,cartController.removeOrderedItems);
module.exports = router;
