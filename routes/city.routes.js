const express = require('express');
const router = express.Router();
const CityController = require('../controllers/city.controller');

// Add a new city
router.post('/add', CityController.addCity);

// Get all cities
router.get('/getAll', CityController.getAllCities);

// Increment store count
//router.put('/:cityId/increment', CityController.incrementStoreCount);

module.exports = router;
