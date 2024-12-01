const mongoose = require('mongoose'); // Import mongoose
const StoreService = require('../services/store.services');
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

        if (!mongoose.Types.ObjectId.isValid(selectedGenreId)) {
            return res.status(400).json({ status: false, message: "Invalid category ID" });
        }

        // Call StoreService to register the store
        const successRes = await StoreService.registerStore({
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

        if (successRes.error) {
            return res.status(400).json({
                status: false,
                message: successRes.error,
            });
        }

        res.status(201).json({
            status: true,
            message: "Store registered successfully",
            data: successRes
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

