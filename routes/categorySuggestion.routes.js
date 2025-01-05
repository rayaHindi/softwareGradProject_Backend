const express = require('express');
const router = express.Router();
const CategorySuggestionController = require('../controllers/categorySuggestion.controller');
const authenticateToken = require('../middleware/authMiddleware');

// Routes
router.post('/submitNewSuggestion', authenticateToken, CategorySuggestionController.submitSuggestion);
router.get('/getAllSuggestions', authenticateToken, CategorySuggestionController.getSuggestions);
router.patch('/updateSuggestionStatus/:suggestionId', authenticateToken, CategorySuggestionController.updateSuggestionStatus);

module.exports = router;
