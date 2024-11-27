const StoreModel = require('../model/store.model');

class StoreService {
    static async registerStore({ storeName, contactEmail, phoneNumber, password, accountType = 'S', country, city, allowSpecialOrders, selectedGenre }) {
        try {
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
                selectedGenre
            });

            // Save the new store to the database
            return await createStore.save();
        } catch (err) {
            // Handle and propagate any errors
            throw err;
        }
    }
}

module.exports = StoreService;
