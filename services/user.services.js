//user.services.js
//In services, all the database operation happens like fetching, Insertion, Deletion.
const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

class UserServices {

    static async registerUser({ firstName, lastName, email, phoneNumber, password, accountType = 'U', selectedGenres = [] }) {
        try {
            // Create a new user with all the provided fields
            const createUser = new UserModel({
                firstName,
                lastName,
                email,
                phoneNumber,
                password,
                accountType,
                selectedGenres
            });

            // Save the new user to the database
            return await createUser.save();
        } catch (err) {
            // Handle and propagate any errors
            throw err;
        }
    }
    static async getUserByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (err) {
            console.log(err);
        }
    }
    static async findUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email });
            /*if (!user) {
                throw new Error('User not found');
            }*/
            return user;
        } catch (error) {
            throw error;
        }
    }
    static async getUserById(userId) {
        try {
            return await UserModel.findById(userId).select('-password'); // Exclude the password
        } catch (err) {
            throw err;
        }
    }
    static async checkUser(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }
    static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }//

    static async resetUserPassword(userId, newPassword) {
        try {
            // Find the user by ID
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Update the user's password
            user.password = newPassword; // This will trigger the pre-save hook to hash the password
            await user.save();
    
            return user;
        } catch (error) {
            throw error;
        }
    }
    

    static async resetUserPasswordWithOldPass(userId, oldPassword, newPassword) {
        try {
            // Find the user by ID
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
    
            // Verify that the old password matches the hashed password in the database
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                throw new Error('Old password is incorrect');
            }
    
            // Hash the new password before saving it
           // const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
            // Update the user's password
            user.password = newPassword; // This will trigger the pre-save hook to hash the password
            await user.save();
    
            return user;
        } catch (error) {
            throw error;
        }
    }
    
    static async updateUserInfo(userId, updateData) {
        try {
            // Find the user by ID and update only the fields in updateData
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true } // true-> return new object  validators->check if data valid
            ).select('-password'); // Exclude password from the returned document

            // Check if the user was found and updated
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser; // Return the updated user
        } catch (error) {
            throw error; // Rethrow error to be handled in the controller
        }
    }
    static async addCreditCard(userId, cardDetails) {
        try {
            // Find the user by ID and update their credit card details
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Add or update the card details
            user.visaCard = cardDetails;

            // Save the updated user object
            await user.save();

            return user; // Return the updated user
        } catch (error) {
            throw error; // Rethrow the error to be handled in the controller
        }
    }
    static async getCreditCardData(userId) {
        try {
            // Find the user by ID and retrieve only the visaCard field
            const user = await UserModel.findById(userId).select('visaCard');

            if (!user) {
                throw new Error('User not found');
            }

            // Check if visaCard is null or undefined
            if (!user.visaCard) {
                return null; // Return null explicitly if no credit card data
            }

            // Return the credit card details
            return user.visaCard;
        } catch (error) {
            throw new Error('Error fetching credit card data: ' + error.message);
        }
    }


}

module.exports = UserServices;
