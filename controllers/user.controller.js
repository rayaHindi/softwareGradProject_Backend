//user.controller.js
const UserServices = require('../services/user.services.js');
const StoreServices = require('../services/store.services.js');
const StoreModel = require('../model/store.model.js'); // Import your Store model

const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const UserModel = require('../model/user.model.js');

require('dotenv').config(); // Load environment variables


exports.register = async (req, res, next) => {
    try {
        // Destructure all required fields from the request body
        const { firstName, lastName, email, phoneNumber, password, accountType, selectedGenres } = req.body;

        // Call the UserService to register the user with all fields
        const newUser = await UserServices.registerUser({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            accountType,
            selectedGenres
        });

        // Generate token
        const tokenData = {
            _id: newUser._id,
            email: newUser.email,
            userType: accountType === 'A' ? 'admin' : 'user'
        };
        const token = jwt.sign(tokenData, "secret", { expiresIn: '1h' });

        // Respond with success message, token, and user data
        res.status(201).json({
            status: true,
            message: "Registered successfully",
            token: token,
            userType: 'user',
            data: newUser,
        });
    } catch (err) {
        // Catch duplicate email error (MongoServerError code 11000 indicates duplicate key error)
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({
                status: false,
                message: "User with this email already exists"
            });
        }

        // Catch and handle other errors, returning a meaningful error response
        console.error(err);
        res.status(500).json({
            status: false,
            message: "Error registering user",
            error: err.message
        });
    }
};
exports.checkEmailAvailability = async (req, res) => {
    try {
        const { email } = req.query;

        // Validate the email
        if (!email || !email.includes('@')) {
            return res.status(400).json({ status: false, message: "Invalid email address" });
        }

        // Check if user already exists by email
        const existingUser = await UserServices.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                status: false,
                message: "User with this email already exists",
            });
        }

        res.status(200).json({
            status: true,
            message: "Email is available",
        });
    } catch (error) {
        console.error('Error during email availability check:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to check email availability',
            error: error.message,
        });
    }
};
exports.getUserId = (req, res) => {
    // Access the user ID attached by the middleware
    const userId = req.user._id;

    if (!userId) {
        return res.status(404).json({ message: 'User ID not found in token' });
    }

    res.json({ userId });
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

        console.log('User Type:');
        console.log(userType);

        // Extract data based on userType
        let responseData;
        if (userType === 'user') {
            responseData = {
                email: user.email,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
            };
        } else if (userType === 'store') {
            responseData = {
                email: user.email,
                storeName: user.storeName || '',
            };
        }


        // Return user data, token, and userType
        res.status(200).json({
            status: true,
            success: "sendData",
            token: token,
            userType: userType,
            data: responseData
        });
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
        console.log(`sending email to ${email}`);


        if (!user) {
            console.log(`not user`);
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        // Generate a temporary password
        const tempPassword = '5555';//Math.random().toString(36).slice(-8); // Simple random password (8 characters)
        await UserServices.resetUserPassword(user._id, tempPassword)
        console.log(`temp pass ${tempPassword}`);

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
exports.getFullName = async (req, res) => {
    try {
        // Assuming the email is sent in the request body or headers
        const email = req.headers['email'];

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Fetch the user from the database using the email
        const user = await UserModel.findOne({ email }).select('firstName lastName');
        console.log("user info");
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the user's full name as the response
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
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
/*
exports.addFavoriteStore = async (req, res) => {
    const userId = req.user._id;
    const { storeId } = req.params;

    try {
        const updatedUser = await UserServices.addFavoriteStore(userId, storeId);

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log("Store added to favorites");
        res.status(200).json({ success: true, message: "Store added to favorites", user: updatedUser });
    } catch (error) {
        console.error("Error adding favorite store:", error);
        res.status(500).json({ success: false, message: "Failed to add store to favorites" });
    }
};
exports.removeFavoriteStore = async (req, res) => {
    const userId = req.user._id; // Extracted from auth middleware
    const { storeId } = req.params;

    try {
        // Call the service to remove the store from the favorites
        const updatedUser = await UserServices.removeFavoriteStore(userId, storeId);

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Store removed from favorites",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error removing favorite store:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove store from favorites",
        });
    }
};
*/
exports.addToWishlist = async (req, res) => {
    const userId = req.user._id; // Extracted from middleware
    const { productId } = req.params;

    try {
        const updatedUser = await UserServices.addToWishlist(userId, productId);

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Product added to wishlist", user: updatedUser });
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        res.status(500).json({ success: false, message: "Failed to add product to wishlist" });
    }
};

exports.removeFromWishlist = async (req, res) => {
    const userId = req.user._id; // Extracted from middleware
    const { productId } = req.params;

    try {
        const updatedUser = await UserServices.removeFromWishlist(userId, productId);

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Product removed from wishlist", user: updatedUser });
    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        res.status(500).json({ success: false, message: "Failed to remove product from wishlist" });
    }
};
exports.checkIfInWishlist = async (req, res) => {
    console.log('checkIfInWishlist');
    const userId = req.user._id;
    const { productId } = req.params;

    try {
        const isInWishlist = await UserServices.checkIfInWishlist(userId, productId);
        res.status(200).json({ success: true, isInWishlist });
    } catch (error) {
        console.error("Error checking wishlist:", error);
        res.status(500).json({ success: false, message: "Failed to check wishlist" });
    }
};
exports.getWishList = async (req, res) => {
    console.log("Fetching user's wishlist");
    const userId = req.user._id;

    try {
        const wishlistProducts = await UserServices.getWishList(userId);
        res.status(200).json({ success: true, products: wishlistProducts });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ success: false, message: "Failed to fetch wishlist" });
    }
};
exports.storesOfFavCategories = async (req, res) => {
    const userId = req.user._id;
    try {
        const recommendedStores = await UserServices.getstoresOfFavCategories(userId);
        res.status(200).json({ success: true, stores: recommendedStores });
    } catch (error) {
        console.error("Error fetching recommended stores:", error);
        res.status(500).json({ success: false, message: "Failed to fetch recommended stores" });
    }
};
///////////////////////point system///////////////////////

exports.addPoints = async (req, res) => {
    const { storeId, points } = req.body; // Only receiving storeId and points
    const userId = req.user._id;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Fetch store details to get the storeName
        const store = await StoreModel.findById(storeId);
        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }

        const storeName = store.storeName; // Retrieve storeName

        // Check if the store already exists in the user's points
        if (user.points.has(storeId)) {
            user.points.get(storeId).totalPoints += points; // Increment points
        } else {
            // Add a new entry for the store
            user.points.set(storeId, { storeName, totalPoints: points });
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Points added successfully',
            points: user.points
        });
    } catch (error) {
        console.error('Error adding points:', error);
        res.status(500).json({ success: false, message: 'Failed to add points' });
    }
};


// Remove points from a user's account for a specific store
exports.removePoints = async (req, res) => {
    const { storeId, points } = req.body; // Extract storeId and points from request
    const userId = req.user._id;

    try {
        // Fetch the user
        const user = await UserModel.findById(userId);

        if (!user) {
            console.log(`[DEBUG] User not found for ID: ${userId}`);
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the store exists in the user's points map
        if (!user.points || !user.points.has(storeId)) {
            console.log(`[DEBUG] No points found for store with ID: ${storeId}`);
            return res.status(404).json({
                success: false,
                message: `No points found for store with ID ${storeId}`,
            });
        }

        // Retrieve current points for the store
        const storeData = user.points.get(storeId);
        const currentPoints = storeData.totalPoints || 0;

        console.log(`[DEBUG] Current points for store ${storeId}: ${currentPoints}`);

        if (points > currentPoints) {
            console.log(
                `[DEBUG] Insufficient points to deduct. Requested: ${points}, Available: ${currentPoints}`
            );
            return res.status(400).json({
                success: false,
                message: `Insufficient points to deduct. Current points: ${currentPoints}`,
            });
        }

        // Deduct points, ensuring they don't go below zero
        const updatedPoints = Math.max(0, currentPoints - points);
        console.log(`[DEBUG] Updated points for store ${storeId}: ${updatedPoints}`);
        storeData.totalPoints = updatedPoints;

        // If points reach zero, consider removing the entry entirely
        if (updatedPoints === 0) {
            //console.log(`[DEBUG] Removing store ${storeId} from user points map as points reached zero.`);
            //user.points.delete(storeId);
        }

        // Save the updated user document
        await user.save();

        console.log(`[DEBUG] Successfully updated points for user ${userId}`);
        res.status(200).json({
            success: true,
            message: `Points removed successfully from store ID ${storeId}`,
            points: user.points,
        });
    } catch (error) {
        console.error(`[DEBUG] Error removing points: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to remove points' });
    }
};


// Get all points for the user
exports.getAllPoints = async (req, res) => {
    const userId = req.user._id;

    try {
        // Find the user
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Populate the store information (e.g., logo, name)
        const pointsWithStoreInfo = await Promise.all(
            Array.from(user.points.entries()).map(async ([storeId, pointData]) => {
                const store = await StoreModel.findById(storeId).select('storeName logo');
                if (!store) {
                    return null; // Skip if the store doesn't exist
                }
                return {
                    storeId,
                    storeName: store.storeName,
                    logo: store.logo, // Include the store's logo URL
                    totalPoints: pointData.totalPoints,
                };
            })
        );

        // Filter out any null entries (if stores are missing)
        const filteredPoints = pointsWithStoreInfo.filter((entry) => entry !== null);

        res.status(200).json({ success: true, points: filteredPoints });
    } catch (error) {
        console.error('Error fetching points:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch points' });
    }
};

// Get points for a specific store
exports.getPointsForStore = async (req, res) => {
    const userId = req.user._id;
    const { storeId } = req.params;

    try {
        const user = await UserModel.findById(userId);

        if (!user || !user.points.has(storeId)) {
            return res.status(404).json({ success: false, message: 'Store points not found for user' });
        }

        res.status(200).json({ success: true, points: user.points.get(storeId) });
    } catch (error) {
        console.error('Error fetching points for store:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch points for store' });
    }
};

exports.getUserEmail = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the user by their ID in the database
        const user = await UserModel.findById(userId).select('email'); // Only fetch the email field

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Return the email
        res.status(200).json({
            success: true,
            email: user.email,
        });
    } catch (error) {
        console.error("Error fetching user email:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user email",
            error: error.message,
        });
    }
};

exports.getAdmins = async (req, res) => {
    try {
        // Fetch all admins except the main admin
        const admins = await UserModel.find({
            accountType: "A",
            email: { $ne: "Admin@gmail.com" } // Exclude main admin
        }).select("_id firstName lastName email phoneNumber"); // Fetch required fields only

        res.status(200).json({
            success: true,
            data: admins
        });
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admins",
            error: error.message
        });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.adminId;

        // Check if the admin being deleted is the main admin
        const admin = await UserModel.findById(adminId);
        if (!admin || admin.email === "Admin@gmail.com") {
            return res.status(403).json({
                success: false,
                message: "Cannot delete main admin"
            });
        }

        // Delete the admin
        await UserModel.findByIdAndDelete(adminId);

        res.status(200).json({
            success: true,
            message: "Admin deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete admin",
            error: error.message
        });
    }
};

exports.getStatistics = async (req, res) => {
    try {
        // Get the user with the most orders
        const topUser = await UserModel.findOne({ accountType: 'U' })
            .sort({ numberOfOrders: -1 })
            .select('firstName lastName email numberOfOrders phoneNumber')
            .lean();

        // Count total users with accountType 'U'
        const totalUsers = await UserModel.countDocuments({ accountType: 'U' });

        // Count total stores
        const totalStores = await StoreModel.countDocuments();

        // Send the response
        res.status(200).json({
            success: true,
            data: {
                topUser: topUser || null, // Return null if no user found
                totalUsers,
                totalStores,
            },
        });
    } catch (err) {
        console.error('Error fetching statistics:', err.message);
        res.status(500).json({ success: false, message: 'Error fetching statistics' });
    }
};