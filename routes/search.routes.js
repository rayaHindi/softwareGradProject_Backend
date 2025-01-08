const express = require('express');
const router = express.Router();
const { incrementSearchCounts,getSuggestedProducts } = require('../controllers/search.controller');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/incrementSearchCounts', authenticateToken, incrementSearchCounts);
router.get('/getSuggestedProducts', authenticateToken, getSuggestedProducts);

module.exports = router;
