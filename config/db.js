const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb://localhost:27017/CraftBlend', {
    serverSelectionTimeoutMS: 5000, // Set a timeout for MongoDB connection attempts
}).on('open', () => {

    console.log('Mongo connected');
}).on('error', () => {
    console.log('error connecting');
});
mongoose.connection.on('timeout', () => {
    console.log('MongoDB connection timed out');
});

module.exports = connection;