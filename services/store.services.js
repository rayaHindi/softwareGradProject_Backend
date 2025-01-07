const StoreModel = require('../model/store.model');
const UserService = require('../services/user.services');
const CityModel = require('../model/city.model');
const OrderModel = require("../model/order.model");

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
            const cityExists = await CityModel.findById(city);
            if (!cityExists) {
                throw new Error('Invalid city selected');
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
            const store = await StoreModel.findById(storeId)
                .populate('city', 'name') // Populate the city reference
                .populate('category', 'name'); // Populate the category reference

            if (!store) {
                throw new Error('Store not found');
            }
            return store;
        } catch (error) {
            throw new Error('Error fetching store details: ' + error.message);
        }
    }

    static async getDeliveryCities(storeId) {
        try {
            const store = await StoreModel.findById(storeId).populate('deliveryCities.city', 'name'); // Populate city name

            if (!store) {
                throw new Error('Store not found');
            }

            // Map the delivery cities to include city name and delivery cost
            const formattedDeliveryCities = store.deliveryCities.map((entry) => ({
                cityName: entry.city.name, // City name from the populated city field
                cityId: entry.city._id,   // City ID
                deliveryCost: entry.deliveryCost, // Delivery cost
            }));

            return formattedDeliveryCities; // Return the formatted list
        } catch (err) {
            throw new Error('Error fetching delivery cities: ' + err.message);
        }
    }

    static async updateDeliveryCities(storeId, deliveryCities) {
        try {
            // Update the deliveryCities field for the given store
            const updatedStore = await StoreModel.findByIdAndUpdate(
                storeId,
                { deliveryCities },
                { new: true, runValidators: true }
            );

            if (!updatedStore) {
                throw new Error('Store not found');
            }

            return updatedStore.deliveryCities; // Return the updated delivery cities
        } catch (err) {
            throw new Error('Error updating delivery cities: ' + err.message);
        }
    }
    static async getAllStores() {
        try {
            const stores = await StoreModel.find();
            return stores;

        } catch (err) {
            throw new Error('Error fetching stores: ' + err.message);
        }
    }
    static async getMostSearchedStores(limit = 3) {
        try {
            return await StoreModel.find()
                .sort({ searchCount: -1 }) // Sort by descending search count
                .limit(limit); // Fetch top `limit` results
        } catch (error) {
            throw new Error('Error fetching most searched stores: ' + error.message);
        }
    }

    static async incrementStoreSearchCount(storeId) {
        try {
            // Increment the search count for a store by its ID
            await StoreModel.findByIdAndUpdate(
                storeId,
                { $inc: { searchCount: 1 } },
                { new: true }
            );
        } catch (error) {
            throw new Error('Error incrementing store search count: ' + error.message);
        }
    }
    static async getStoreById(storeId) {
        try {
            const store = await StoreModel.findById(storeId)
                .populate('city', 'name') // Populate the city reference
                .populate('category', 'name'); // Populate the category reference

            if (!store) {
                throw new Error('Store not found');
            }

            return store; // Return the populated store document
        } catch (error) {
            throw new Error('Error fetching store by ID: ' + error.message);
        }
    }
    static async updateStoreRating(storeId, storeRating, orderId) {
        try {
            console.log('in updateStoreRating service');
    
            // Ignore the update if the rating is 0
            if (storeRating === 0) {
                console.log('Store rating is 0, skipping update');
                return null;
            }
    
            // Find the store
            const store = await StoreModel.findById(storeId);
            if (!store) return null;
    
            // Update store rating
            store.rating.total += storeRating;
            store.rating.count += 1;
            store.rating.average = store.rating.total / store.rating.count;
    
            await store.save();
    
            // Update the `hasRatedStore` flag in the order
            await OrderModel.updateOne(
                { _id: orderId },
                { $set: { hasRatedStore: true } }
            );
    
            return store;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
}

module.exports = StoreService;
