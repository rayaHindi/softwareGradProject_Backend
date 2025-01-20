// routes/specialOrderRouter.js

const express = require('express');
const router = express.Router();
const specialOrderController = require('../controllers/specialOrder.controller');
const authenticateToken = require('../middleware/authMiddleware');


router.post('/create',authenticateToken, specialOrderController.createSpecialOrder);
router.get('/getStoreSpecialOrders',authenticateToken, specialOrderController.getStoreSpecialOrders);
router.get('/getByID/:orderId',authenticateToken, specialOrderController.getSpecialOrderById);
router.put('/updateStatus/:orderId',authenticateToken, specialOrderController.updateSpecialOrderStatus);
router.get('/getUserSpecialOrders', authenticateToken, specialOrderController.getUserSpecialOrders);
router.put('/:specialOrderId/markAsPaid', authenticateToken, specialOrderController.markAsPaid);

module.exports = router;
