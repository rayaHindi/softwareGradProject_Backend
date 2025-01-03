const express = require('express');
const router = express.Router();
const { incrementSearchCounts } = require('../controllers/search.controller');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/incrementSearchCounts', authenticateToken, incrementSearchCounts);

module.exports = router;
