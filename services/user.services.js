//user.services.js
//In services, all the database operation happens like fetching, Insertion, Deletion.
const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
class UserServices{
 
    static async registerUser(firstName, lastName, phoneNumber, email, password) {
        try {
            console.log("-----User Info-----", firstName, lastName, phoneNumber, email, password);
    
            const createUser = new UserModel({ firstName, lastName, phoneNumber, email, password });
            return await createUser.save();
        } catch (err) {
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
}
module.exports = UserServices;
