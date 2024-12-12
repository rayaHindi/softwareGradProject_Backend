const CityServices = require('../services/city.services');

exports.addCity = async (req, res) => {
    try {
        const { name, coordinates } = req.body;

        const city = await CityServices.addCity(name, coordinates);

        res.status(201).json({ success: true, message: 'City added successfully', city });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllCities = async (req, res) => {
    try {
        const cities = await CityServices.getAllCities();
        res.status(200).json({ success: true, cities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/*
exports.incrementStoreCount = async (req, res) => {
    try {
        const { cityId } = req.params;
        if (!cityId) {
            return res.status(400).json({ success: false, message: 'City ID is required' });
        }

        const city = await CityServices.incrementStoreCount(cityId);
        console.log('Store count incremented');
        res.status(200).json({ success: true, message: 'Store count incremented', city });
    } catch (error) {
        console.log('erroooor incrementing store count');

        res.status(500).json({ success: false, message: error.message });
    }
};
*/