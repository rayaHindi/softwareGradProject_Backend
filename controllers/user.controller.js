//user.controller.js
const UserServices = require('../services/user.services.js');
const StoreServices = require('../services/store.services.js');

const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables




exports.register = async (req, res, next) => {
    try {
        // Destructure all required fields from the request body
        const { firstName, lastName, email, phoneNumber, password, accountType, selectedGenres } = req.body;

        // Call the UserService to register the user with all fields
        const successRes = await UserServices.registerUser({
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
exports.login = async (req, res, next) => {
    try {
        console.log('in login');
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Parameters are not correct' });
        }

        let user = await UserServices.checkUser(email);
        let userType;

        // Check if user exists in the User model
        if (user) {
            // If the user is an admin, set userType as 'admin'
            if (user.accountType === 'A') {
                userType = 'admin';
            } else {
                userType = 'user';
            }
        } else {
            // Check if store owner exists in the Store model
            user = await StoreServices.checkStoreByEmail(email);
            if (!user) {
                return res.status(404).json({ status: false, message: 'User with this email does not exist' });
            }

            userType = 'store';
        }

        // Verify password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ status: false, message: 'Password does not match' });
        }

        // Generate token
        const tokenData = { _id: user._id, email: user.email, userType };
        const token = jwt.sign(tokenData, "secret", { expiresIn: '1h' });

        console.log('after generating token for the user token:');
        console.log(token);

        // Return user type along with the token
        res.status(200).json({ status: true, success: "sendData", token: token, userType: userType });
    } catch (error) {
        console.error('Error during login:', error);
        next(error);
    }
};


exports.validateToken = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token
        //const jwtSecret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, "secret");
        console.log('in validating token when remmember me checked decoded:');
        console.log(decoded);

        res.status(200).json({ status: true, message: 'Token is valid' });
    } catch (error) {
        res.status(401).json({ status: false, message: 'Token is invalid or expired' });
    }
};


// Add your transporter configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Use 465 for SSL or 587 for TLS
    secure: true, // true for 465, false for 587
    auth: {
        user: 'craftblend2024@gmail.com', // your Gmail email address
        pass: 'craftBlend_2024$', // Your email password or app-specific password
    },
});

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body; // Get email from request body
        const user = await UserServices.getUserByEmail(email);
        console.log( `sending email to ${email}`);


        if (!user) {
            console.log( `not user`);
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        // Generate a temporary password
        const tempPassword = '5555';//Math.random().toString(36).slice(-8); // Simple random password (8 characters)
        await UserServices.resetUserPassword(user._id, tempPassword)
        console.log( `temp pass ${tempPassword}`);

        //await user.save(); // Save the updated user to the database

        // Send the email
        const mailOptions = {
            from: 'craftblend2024@gmail.com', // Sender address
            to: email, // List of receivers
            subject: 'Your Temporary Password for craftBlend', // Subject line
            text: `Your temporary password is: ${tempPassword}. Please use it to log in and change your password.`, // Plain text body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error.message); // Log only the message part for clarity
                return res.status(500).json({ status: false, message: 'Error sending email' });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ status: true, message: 'Temporary password sent to your email.' });
        });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
};


exports.resetPassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id; // Extracted from middleware (assuming the user is authenticated)

        // Call the service to reset the password
        await UserServices.resetUserPasswordWithOldPass(userId, oldPassword, newPassword);

        res.status(200).json({ status: true, message: 'Password reset successfully.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(400).json({ status: false, message: error.message });
    }
};

exports.getPersonalInfo = async (req, res, next) => {
    try {
        const userId = req.user._id; // Extracted from middleware
        console.log('userId');
        console.log(userId);
        // Fetch user information from the database
        const user = await UserServices.getUserById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        res.status(200).json({
            status: true,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                // Additional fields can be added here
            }
        });
    } catch (error) {
        console.error('Error fetching personal info:', error);
        next(error);
    }
};

exports.updateUserPersonalInfo = async (req, res) => {
    try {
        const userId = req.user._id; // Extracted from middleware

        const updateData = {};
        if (req.body.firstName) updateData.firstName = req.body.firstName;
        if (req.body.lastName) updateData.lastName = req.body.lastName;
        if (req.body.phoneNumber) updateData.phoneNumber = req.body.phoneNumber;
        if (req.body.email) updateData.email = req.body.email;

        const updatedUser = await UserServices.updateUserInfo(userId, updateData);

        res.status(200).json({
            message: 'User information updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user info:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data provided', errors: error.errors });
        }
        return res.status(500).json({ message: 'An error occurred while updating user information' });
    }
};

exports.addCreditCard = async (req, res, next) => {
    try {
        const userId = req.user._id; // Extract user ID from authenticated user
        const { visaCard } = req.body; // Destructure visaCard from the request body
        console.log('Received body:', req.body); // Log the incoming body

        // Ensure all required fields in the visaCard object are provided
        if (!visaCard || !visaCard.cardNumber || !visaCard.expiryMonth || !visaCard.expiryYear || !visaCard.cardCode || !visaCard.firstName || !visaCard.lastName) {
            return res.status(400).json({ status: false, message: 'All card details must be provided' });
        }

        // Update the user's credit card details
        const updatedUser = await UserServices.addCreditCard(userId, visaCard); // Pass the visaCard object directly
        console.log('Credit card added successfully');
        res.status(200).json({
            status: true,
            message: 'Credit card added successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error adding credit card:', error);
        next(error);
    }
};
  
  exports.getCreditCardData = async (req, res) => {
    try {
        // The user ID is extracted from the JWT token in middleware
        const userId = req.user._id; // Assuming middleware sets `req.user`

        // Fetch credit card data using the service
        const creditCardData = await UserServices.getCreditCardData(userId);

        if (!creditCardData || Object.keys(creditCardData).length === 0) {
            return res.status(404).json({ message: 'No credit card information found.' });
            console.log(`creditCard: ${creditCardData}`);
        }

        return res.status(200).json({ status: true, creditCard: creditCardData });
    } catch (error) {
        console.error('Error fetching credit card data:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};