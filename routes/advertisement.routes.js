const express = require('express');
const router = express.Router();
const advertisementController = require('../controllers/advertisement.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Add an advertisement (Store-specific)
router.post('/add', authMiddleware, advertisementController.addAdvertisement);

// Get all advertisements (Admin access)
router.get('/getAll',authMiddleware, advertisementController.getAdvertisements);
router.get('/getSoreAd',authMiddleware, advertisementController.getStoreAdvertisements);

// Export the router
module.exports = router;
