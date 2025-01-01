//order routes
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/placeOrder',authMiddleware,orderController.placeOrder);
// Get orders by store ID
router.get('/getOrdersByStoreId', authMiddleware, orderController.getOrdersByStoreId);

// Get orders for a user
router.get('/getUserOrders', authMiddleware, orderController.getUserOrders);

// Update order status
router.put('/:orderId/updateOrderStatus', authMiddleware, orderController.updateOrderStatus);

router.patch('/updateItemStatus/:orderId',authMiddleware, orderController.updateItemStatus);

module.exports = router;
