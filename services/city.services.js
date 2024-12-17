const CityModel = require('../model/city.model');

class CityServices {
    // Add a new city
    static async addCity(name, coordinates) {
        try {
            const city = new CityModel({ name, coordinates });
            return await city.save();
        } catch (error) {
            console.error('Error in addCity:', error);
            throw new Error('Unable to add city');
        }
    }

    // Get all cities
    static async getAllCities() {
        try {
            return await CityModel.find();
        } catch (error) {
            console.error('Error in getAllCities:', error);
            throw new Error('Unable to fetch cities');
        }
    }

    /*
    // Increment store count for a city
    static async incrementStoreCount(cityId) {
        try {
            const city = await CityModel.findByIdAndUpdate(
                cityId,
                { $inc: { storesCount: 1 } },
                { new: true }
            );
            if (!city) {
                throw new Error('City not found');
            }
            return city;
        } catch (error) {
            console.error('Error in incrementStoreCount:', error);
            throw new Error('Unable to increment store count');
        }
    }
}*/
static async incrementStoreCount(cityId) {
    try {
        const city = await CityModel.findByIdAndUpdate(
            cityId,
            { $inc: { storesCount: 1 } }, // Increment the store count by 1
            { new: true, runValidators: true } // Return the updated city and enforce schema validation
        );

        if (!city) {
            throw new Error('City not found'); // Throw error if city does not exist
        }

        return city;
    } catch (error) {
        throw error; // Re-throw error to be handled by the caller
    }
}
}

module.exports = CityServices;
