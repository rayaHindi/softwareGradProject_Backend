const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb://localhost:27017/CraftBlend').on('open', () => {
    console.log('Mongo connected');
}).on('error', () => {
    console.log('error connecting');
});

module.exports = connection;