//user.services.js
//In services, all the database operation happens like fetching, Insertion, Deletion.
const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
class UserServices{
 
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
    static async getUserByEmail(email){
        try{
            return await UserModel.findOne({email});
        }catch(err){
            console.log(err);
        }
    }
    static async getUserById(userId) {
        try {
            return await UserModel.findById(userId).select('-password'); // Exclude the password
        } catch (err) {
            throw err;
        }
    }
    static async checkUser(email){
        try {
            return await UserModel.findOne({email});
        } catch (error) {
            throw error;
        }
    }
    static async generateAccessToken(tokenData,JWTSecret_Key,JWT_EXPIRE){
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }

    static async resetUserPassword(userId, newPassword) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
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
