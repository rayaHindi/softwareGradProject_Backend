const UserService = require('../services/user.services');

exports.register = async (req, res, next) => {
    try {
        // Destructure all required fields from the request body
        const { firstName, lastName, email, phoneNumber, password, accountType, selectedGenres } = req.body;

        // Call the UserService to register the user with all fields
        const successRes = await UserService.registerUser({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            accountType,
            selectedGenres
        });

        // Respond with a success message
        res.status(201).json({
            status: true,
            message: "Registered successfully",
            data: successRes
        });
    } catch (err) {
        // Catch and handle errors, returning a meaningful error response
        console.error(err);
        res.status(500).json({
            status: false,
            message: "Error registering user",
            error: err.message
        });
    }
};
