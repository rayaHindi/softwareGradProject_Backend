//cart routes
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/addNewCartItem', authMiddleware, cartController.addItem);
router.get('/getCartData', authMiddleware, cartController.getCart);
router.delete('/remove/:productId', authMiddleware, cartController.removeItem);
router.put('/updateCartItem', authMiddleware, cartController.updateCartItem);

module.exports = router;
