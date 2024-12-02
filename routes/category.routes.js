// category.routes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Route to add a new category
router.post('/add', categoryController.addCategory);

// Route to delete a category
router.delete('/delete/:id', categoryController.deleteCategory);

// Route to get all categories
router.get('/all', categoryController.getAllCategories);

router.get('/categories-and-stores', categoryController.getCategoriesAndStores);

router.get('/:categoryId/stores', categoryController.getStoresByCategory);

module.exports = router;

