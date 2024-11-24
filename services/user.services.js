const UserModel = require('../model/user.model');

class UserService {
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
}

module.exports = UserService;
