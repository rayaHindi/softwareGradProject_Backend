// category.service.js
const CategoryModel = require('../model/category.model');

// Service to add a new category
exports.addCategory = async ({ name, description }) => {
    try {
        // Create a new category instance
        const newCategory = new CategoryModel({
            name,
            description,
        });

        // Save the category to the database
        await newCategory.save();
        return newCategory;
    } catch (error) {
        console.error('Error in category service:', error);
        throw new Error('Unable to add category');
    }
};

// Service to check if a category has stores
exports.hasStores = async (id) => {
    try {
        const category = await CategoryModel.findById(id).populate('stores');
        return category && category.stores && category.stores.length > 0;
    } catch (error) {
        console.error('Error in category service:', error);
        throw new Error('Unable to check if category has stores');
    }
};

// Service to delete a category
exports.deleteCategory = async (id) => {
    try {
        // Find the category by ID and delete it
        await CategoryModel.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error in category service:', error);
        throw new Error('Unable to delete category');
    }
};

// Service to get all categories
exports.getAllCategories = async () => {
    try {
        // Find all categories
        const categories = await CategoryModel.find();
        return categories;
    } catch (error) {
        console.error('Error in category service:', error);
        throw new Error('Unable to fetch categories');
    }
};