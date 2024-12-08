// category.services.js
const CategoryModel = require('../model/category.model');

class CategoryServices {
    // Add a new category
    static async addCategory({ name, description, image }) {
        try {
            console.log('addding new category phot: ');
            console.log(image);
            const newCategory = new CategoryModel({
                name,
                description,
                image, // Save the photo URL in the database
            });
            await newCategory.save();
            return newCategory;
        } catch (error) {
            console.error('Error in category service:', error);
            throw new Error('Unable to add category');
        }
    }
    
    // Check if a category has stores
    static async hasStores(id) {
        try {
            const category = await CategoryModel.findById(id).populate('stores');
            return category && category.stores && category.stores.length > 0;
        } catch (error) {
            console.error('Error in category service:', error);
            throw new Error('Unable to check if category has stores');
        }
    }

    // Delete a category
    static async deleteCategory(id) {
        try {
            await CategoryModel.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error in category service:', error);
            throw new Error('Unable to delete category');
        }
    }

    // Get all categories
    static async getAllCategories() {
        try {
            const categories = await CategoryModel.find();
            return categories;
        } catch (error) {
            console.error('Error in category service:', error);
            throw new Error('Unable to fetch categories');
        }
    }

    // Fetch categories with stores
    static async fetchCategoriesWithStores() {
        try {
            const categories = await CategoryModel.find().populate('stores');
            const result = {};

            categories.forEach(category => {
                result[category.name] = category.stores.map(store => ({
                    storeName: store.storeName,
                    contactEmail: store.contactEmail,
                    phoneNumber: store.phoneNumber,
                }));
            });

            return result;
        } catch (error) {
            throw new Error('Error fetching categories with stores: ' + error.message);
        }
    }

    // Add store reference to category
    static async addStoreToCategory(categoryId, storeId) {
        try {
            await CategoryModel.findByIdAndUpdate(
                categoryId,
                { $push: { stores: storeId } },
                { new: true }
            );
        } catch (error) {
            console.error('Error adding store to category:', error);
            throw new Error('Unable to add store to category');
        }
    }
    static async getStoresByCategory(categoryId) {
        try {
            const category = await CategoryModel.findById(categoryId).populate('stores');
            if (!category) {
                throw new Error('Category not found');
            }
            return category.stores.map(store => ({
                _id: store._id,
                storeName: store.storeName,
                contactEmail: store.contactEmail,
                phoneNumber: store.phoneNumber,
                logo: store.logo,
            }));
        } catch (error) {
            console.error('Error fetching stores by category:', error);
            throw new Error('Unable to fetch stores by category');
        }
    }
}

module.exports = CategoryServices;
