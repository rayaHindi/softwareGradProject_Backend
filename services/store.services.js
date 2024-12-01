const StoreModel = require('../model/store.model');

class StoreService {
    static async registerStore({ storeName, contactEmail, phoneNumber, password, accountType = 'S', country, city, allowSpecialOrders, selectedGenreId }) {
        try {
            // Check if a store with the same name already exists
            const existingStore = await StoreModel.findOne({ storeName });
            if (existingStore) {
                throw new Error('A store with this name already exists');
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
}

module.exports = StoreService;
