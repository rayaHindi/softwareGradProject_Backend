const StoreService = require('../services/store.services');

exports.register = async (req, res, next) => {
    try {
        // Destructure all required fields from the request body
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

        // Call the StoreService to register the store with all fields
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

        // Respond with a success message
        res.status(201).json({
            status: true,
            message: "Store registered successfully",
            data: successRes
        });
    } catch (err) {
        // Catch and handle errors, returning a meaningful error response
        console.error(err);
        res.status(500).json({
            status: false,
            message: "Error registering store",
            error: err.message
        });
    }
};
