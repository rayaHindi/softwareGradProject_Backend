const AdvertisementService = require('../services/advertisement.services');

// Run every hour to check for expired advertisements
setInterval(async () => {
    try {
        await AdvertisementService.expireAdvertisements();
        console.log('Checked and expired old advertisements.');
    } catch (error) {
        console.error('Error running advertisement expiration task:', error.message);
    }
}, 60 * 60 * 1000); // 1 hour
