const CityServices = require('../services/city.services');
const CityModel = require('../model/city.model');

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

exports.getCityStatistics = async (req, res) => {
    try {
        console.log('in getCityStatistics');
        const cities = await CityModel.find({}, 'name storesCount');
        const totalStores = cities.reduce((sum, city) => sum + city.storesCount, 0);

        if (totalStores === 0) {
            return res.status(200).json({
                success: true,
                data: cities.map(city => ({
                    name: city.name,
                    percentage: 0,
                    count: city.storesCount,
                })),
            });
        }

        const statistics = cities.map(city => ({
            name: city.name,
            percentage: ((city.storesCount / totalStores) * 100).toFixed(2),
            count: city.storesCount,
        }));
        console.log(statistics);

        res.status(200).json({ success: true, data: statistics });
    } catch (err) {
        console.error('Error fetching city statistics:', err.message);
        res.status(500).json({ success: false, message: 'Error fetching statistics' });
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