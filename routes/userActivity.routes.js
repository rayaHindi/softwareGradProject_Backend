const express = require('express');
const router = express.Router();
const userActivityController = require('../controllers/userActivity.controllor');
const authenticateToken = require('../middleware/authMiddleware');

// Routes
router.get('/getActivity', authenticateToken, userActivityController.getActivity);
router.post('/updateLastVisitedCategory', authenticateToken, userActivityController.updateLastVisitedCategory);
router.post('/addProductVisit', authenticateToken, userActivityController.addProductVisit);
router.post('/addSearchHistory', authenticateToken, userActivityController.addSearchHistory);
router.post('/addStoreView', authenticateToken, userActivityController.addStoreView);

module.exports = router;
