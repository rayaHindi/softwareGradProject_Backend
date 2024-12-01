// category.controller.js
const categoryService = require('../services/category.services');

// Controller to handle adding a new category
exports.addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        // Call the service to add the category
        const newCategory = await categoryService.addCategory({ name, description });

        // Send success response
        res.status(201).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Controller to handle deleting a category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if there are stores under the category
        const hasStores = await categoryService.hasStores(id);
        if (hasStores) {
            return res.status(400).json({ message: 'Category cannot be deleted as there are stores under it' });
        }

        // Call the service to delete the category
        await categoryService.deleteCategory(id);

        // Send success response
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Controller to handle getting all categories
exports.getAllCategories = async (req, res) => {
    try {
        // Call the service to get all categories
        const categories = await categoryService.getAllCategories();

        // Send success response
        res.status(200).json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};