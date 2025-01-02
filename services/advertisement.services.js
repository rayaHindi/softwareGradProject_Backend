const AdvertisementModel = require('../model/advertisement.model');

class AdvertisementService {
    static async addAdvertisement(storeId, image, startDate, endDate, maxDaysDuration) {
        try {
            // Check if the store already has an active ad
            const activeAds = await AdvertisementModel.find({ storeId, status: 'Active' });
            if (activeAds.length >= 1) {
                throw new Error('You already have an active advertisement.');
            }

            // Create new advertisement
            const advertisement = new AdvertisementModel({
                storeId,
                image,
                startDate,
                endDate,
                maxDaysDuration: maxDaysDuration || 7, // Use provided value or default to 7
            });
            return await advertisement.save();
        } catch (error) {
            throw new Error('Failed to add advertisement: ' + error.message);
        }
    }

    static async getAdvertisements() {
        try {
            return await AdvertisementModel.find()
                .populate('storeId', 'storeName')
                .sort({ createdAt: -1 });
        } catch (error) {
            throw new Error('Failed to fetch advertisements: ' + error.message);
        }
    }
    static async getStoreAdvertisements(storeId) {
        try {
            console.log('Fetching ads for storeId:', storeId);
            const ads = await AdvertisementModel.find({ storeId: storeId })
                .select('image startDate endDate status') // Select only the required fields
                .sort({ createdAt: -1 });
            return ads;
        } catch (error) {
            throw new Error('Failed to fetch advertisements: ' + error.message);
        }
    }
    
    
    

    static async expireAdvertisements() {
        try {
            const now = new Date();
            await AdvertisementModel.updateMany(
                { endDate: { $lt: now }, status: 'Active' },
                { status: 'Expired' }
            );
            console.log('Expired advertisements updated.');
        } catch (error) {
            console.error('Error expiring advertisements:', error.message);
        }
    }
}

module.exports = AdvertisementService;
