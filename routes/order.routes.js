//order routes
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/placeOrder', authMiddleware, orderController.placeOrder);
router.get('/getAll', authMiddleware, orderController.getOrders);

module.exports = router;
