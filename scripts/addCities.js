const mongoose = require('mongoose');
const City = require('../model/city.model');
const cities = require('../jsonFiles/cities.json');

mongoose
    .connect('mongodb://localhost:27017/CraftBlend', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(async () => {
        console.log('Connected to the database!');

        for (const city of cities) {
            try {
                await City.create(city);
                console.log(`Added city: ${city.name}`);
            } catch (error) {
                console.error(`Failed to add city: ${city.name} - ${error.message}`);
            }
        }

        mongoose.connection.close();
    })
    .catch((err) => console.error('Database connection failed:', err));
