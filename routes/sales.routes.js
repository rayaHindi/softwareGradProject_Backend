// routes/sales.js
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales.controller');

// Create a new sale
router.post('/createSale', salesController.createSale);

// Get all sales
router.get('/', salesController.getAllSales);

// Get a specific sale by ID
router.get('/:id', salesController.getSaleById);

// Update a sale by ID
router.put('/:id', salesController.updateSale);

// Delete a sale by ID
router.delete('/:id', salesController.deleteSale);

module.exports = router;
