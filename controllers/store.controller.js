const mongoose = require('mongoose'); // Import mongoose
const jwt = require("jsonwebtoken");
const StoreService = require('../services/store.services');
const CategoryModel = require('../model/category.model'); // Import Category Model
exports.register = async (req, res, next) => {
    try {
        const {
            storeName,
            contactEmail,
            phoneNumber,
            password,
            accountType,
            country,
            city,
            allowSpecialOrders,
            selectedGenreId // This is the category ID
        } = req.body;

        // Validate category ID
        if (!mongoose.Types.ObjectId.isValid(selectedGenreId)) {
            return res.status(400).json({ status: false, message: "Invalid category ID" });
        }

        // Call StoreService to register the store
        const newStore = await StoreService.registerStore({
            storeName,
            contactEmail,
            phoneNumber,
            password,
            accountType,
            country,
            city,
            allowSpecialOrders,
            selectedGenreId
        });

        // If there's an error during registration
        if (!newStore) {
            return res.status(400).json({ status: false, message: "Store registration failed" });
        }

        // Add store reference to the category
        const storeId = newStore._id;
        await CategoryModel.findByIdAndUpdate(
            selectedGenreId,
            { $push: { stores: storeId } }, // Add store reference to the stores array
            { new: true }
        );

        // Generate token
        const tokenData = { _id: newStore._id, email: newStore.contactEmail, userType: 'store' };
        const token = jwt.sign(tokenData, "secret", { expiresIn: '1h' });

        // Respond with success message, token, and store data
        res.status(201).json({
            status: true,
            message: "Store registered successfully",
            token: token,
            userType: 'store',
            data: newStore,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: false,
            message: err.message,
            error: err.message
        });
    }
};

