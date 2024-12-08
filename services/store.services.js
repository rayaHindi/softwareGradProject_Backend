const StoreModel = require('../model/store.model');
const UserService = require('../services/user.services');

class StoreService {
    static async registerStore({ storeName, contactEmail, phoneNumber, password, accountType = 'S', country, city, logo, allowSpecialOrders, selectedGenreId }) {
        try {
            const existingStore = await StoreModel.findOne({ storeName });
            if (existingStore) {
                throw new Error('A store with this name already exists');
            }
    
            // Check if the contact email matches any user email or existing store email
            const existingUser = await UserService.findUserByEmail(contactEmail);
            if (existingUser) {
                throw new Error('A user with this email already exists');
            }
            
            const existingStoreByEmail = await StoreModel.findOne({ contactEmail });
            if (existingStoreByEmail) {
                throw new Error('A store with this email already exists');
            }
            // Create a new store with all the provided fields
            const createStore = new StoreModel({
                storeName,
                contactEmail,
                phoneNumber,
                password,
                accountType,
                country,
                city,
                logo,
                allowSpecialOrders,
                category: selectedGenreId // Use category to refer to the selected genre ID
            });

            // Save the new store to the database
            return await createStore.save();
        } catch (err) {
            // Handle and propagate any errors
            throw err;
        }
    }
    static async checkStoreByEmail(email) {
        try {
            // Find a store by its contact email
            const store = await StoreModel.findOne({ contactEmail: email });
            return store; // This will return null if the store is not found
        } catch (err) {
            // Handle and propagate any errors
            throw err;
        }
    }
    static async getStoreDetails(storeId) {
        try {
            const store = await StoreModel.findById(storeId);
            if (!store) {
                throw new Error('Store not found');
            }
            return store;
        } catch (error) {
            throw new Error('Error fetching store details: ' + error.message);
        }
    }
}

module.exports = StoreService;
