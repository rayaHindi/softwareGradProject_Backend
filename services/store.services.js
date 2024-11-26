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
            selectedGenre
        } = req.body;

        const successRes = await StoreService.registerStore({
            storeName,
            contactEmail,
            phoneNumber,
            password,
            accountType,
            country,
            city,
            allowSpecialOrders,
            selectedGenre
        });

        res.status(201).json({
            status: true,
            message: "Store registered successfully",
            data: successRes
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Error registering store",
            error: err.message
        });
    }
};
