//user.controller.js
const UserServices = require('../services/user.services.js');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');


exports.register = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { firstName, lastName, phoneNumber, email, password } = req.body;

        const duplicate = await UserServices.getUserByEmail(email);
        if (duplicate) {
            throw new Error(`User with email ${email} is already registered`);
        }

        const response = await UserServices.registerUser(firstName, lastName, phoneNumber, email, password);
        res.json({ status: true, success: 'User registered successfully' });
    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
};
exports.login = async (req, res, next) => {
    try {
        console.log('in login');
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Parameters are not correct' });
        }
        let user = await UserServices.checkUser(email);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User with this email does not exist' });
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ status: false, message: 'Password does not match' });
        }
        // Creating Token
        const tokenData = { _id: user._id, email: user.email };
        const token = await UserServices.generateAccessToken(tokenData, "secret", "1h");
        console.log('after generating token for the user');
        res.status(200).json({ status: true, success: "sendData", token: token });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }

}

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
        const tempPassword = Math.random().toString(36).slice(-8); // Simple random password (8 characters)
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
        const token = req.headers.authorization?.split(' ')[1]; // Get the token from the header
        const { newPassword } = req.body;

        console.log('Received token:', token); // Log the received token
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token must be provided' });
        }
        // Verify the token
        const decoded = jwt.verify(token, "secret"); // Use the appropriate secret here
        const userId = decoded._id;

        // Call the service to reset the password
        await UserServices.resetUserPassword(userId, newPassword);

        res.status(200).json({ status: true, message: 'Password reset successfully.' });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
};
exports.getPersonalInfo = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ status: false, message: 'Token must be provided' });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, "secret");// Use an environment variable for the secret
        } catch (error) {
            return res.status(401).json({ status: false, message: 'Invalid token' });
        }

        const userId = decoded._id;

        // Fetch user information from the database
        const user = await UserServices.getUserById(userId); // Ensure this function retrieves user data without password

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        console.log(`user to get info ${user}`);

        // Construct response without sensitive info
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
        next(error); // Pass the error to the error handler middleware
    }
};

exports.updateUserPersonalInfo = async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ status: false, message: 'Token must be provided' });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, "secret");// Use an environment variable for the secret
        } catch (error) {
            return res.status(401).json({ status: false, message: 'Invalid token' });
        }

        const userId = decoded._id;

        // Create an object to hold the fields that need to be updated
        const updateData = {};

        // Check which fields are provided and add them to updateData
        if (req.body.firstName) {
            updateData.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            updateData.lastName = req.body.lastName;
        }
        if (req.body.phoneNumber) {
            updateData.phoneNumber = req.body.phoneNumber;
        }
        if (req.body.email) {
            updateData.email = req.body.email;
        }
        // Add checks for other fields if necessary...

        // Call the service to update the user information
        const updatedUser = await UserServices.updateUserInfo(userId, updateData);

        // Respond with success
        res.status(200).json({
            message: 'User information updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user info:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data provided', errors: error.errors });
        }

        // For any other errors, you can return a generic message
        return res.status(500).json({ message: 'An error occurred while updating user information' });
    }
};