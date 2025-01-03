const AdvertisementService = require('../services/advertisement.services');

exports.addAdvertisement = async (req, res) => {
    const { image, startDate, endDate } = req.body;
    const storeId = req.user._id; // Assuming authenticated store user

    try {
        const advertisement = await AdvertisementService.addAdvertisement(
            storeId,
            image,
            startDate,
            endDate,
            //maxDaysDuration
        );
        res.status(201).json({
            success: true,
            message: 'Advertisement added successfully.',
            advertisement,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAdvertisements = async (req, res) => {
    try {
        const advertisements = await AdvertisementService.getAdvertisements();
        res.status(200).json({
            success: true,
            advertisements,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getStoreAdvertisements = async (req, res) => {
    try {
        const storeId = req.user._id;
        const advertisements = await AdvertisementService.getStoreAdvertisements(storeId);
        console.log('store\'s ads');
        console.log(advertisements);
        res.status(200).json({
            success: true,
            advertisements,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.removeAdvertisement = async (req, res) => {
    const adId = req.params.adId; // Advertisement ID from URL
    const storeId = req.user._id; // Store ID from authenticated user

    try {
        const result = await AdvertisementService.removeAdvertisement(adId, storeId);
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found or you are not authorized to delete it.',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Advertisement removed successfully.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove advertisement: ' + error.message,
        });
    }
};
