const mongoose = require('mongoose'); // Import mongoose
const jwt = require("jsonwebtoken");
const storeService = require('../services/store.services');
const categoryModel = require('../model/category.model'); // Import Category Model
const categoryService = require('../services/category.services');
const cityService = require('../services/city.services');

exports.register = async (req, res) => {
    try {
        const {
            storeName,
            contactEmail,
            phoneNumber,
            password,
            accountType,
            country,
            city,
            logo,
            allowSpecialOrders,
            selectedGenreId // Category ID
        } = req.body;

        // Validate category ID
        if (!mongoose.Types.ObjectId.isValid(selectedGenreId)) {
            return res.status(400).json({ status: false, message: "Invalid category ID" });
        }

        // Register the store with a transaction
        const newStore = await storeService.registerStore({
            storeName,
            contactEmail,
            phoneNumber,
            password,
            accountType,
            country,
            city,
            logo,
            allowSpecialOrders,
            selectedGenreId
        },);

        if (!newStore) {
            throw new Error("Store registration failed");
        }

        // Increment the store count in the city
        const updatedCity = await cityService.incrementStoreCount(city);
        if (!updatedCity) {
            throw new Error("City update failed");
        }

        // Add the store to the category
        await categoryService.addStoreToCategory(selectedGenreId, newStore._id);

        // Generate the token
        const tokenData = { _id: newStore._id, email: newStore.contactEmail, userType: 'store' };
        const token = jwt.sign(tokenData, "secret", { expiresIn: '1h' });

        // Respond with success
        res.status(201).json({
            status: true,
            message: "Store registered successfully",
            token: token,
            userType: 'store',
        });
    } catch (error) {
        // Rollback the transaction
        console.error(error);
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

exports.getStoreDetails = async (req, res) => {
    try {
        const storeId = req.user._id; // Assuming middleware sets req.user with the store ID
        const store = await storeService.getStoreDetails(storeId);

        res.status(200).json({
            status: true,
            storeName: store.storeName,
            contactEmail: store.contactEmail,
            phoneNumber: store.phoneNumber,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};
/*
exports.getStoresByCity = async (req, res) => {
    try {
        const { cityId } = req.params;

        const stores = await Store.find({ city: cityId });
        res.status(200).json({ success: true, stores });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
*/
