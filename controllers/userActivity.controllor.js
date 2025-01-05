const UserActivityService = require('../services/userActivity.services');
const UserActivityModel = require('../model/userActivity.model');
exports.getActivity = async (req, res) => {
    const userId = req.user._id;

    try {
        const activity = await UserActivityService.getActivity(userId);
        res.status(200).json({ success: true, activity });
    } catch (error) {
        console.error('Error fetching user activity:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch activity' });
    }
};

exports.updateLastVisitedCategory = async (req, res) => {
    const userId = req.user._id;
    const { categoryId } = req.body;

    try {
        await UserActivityService.updateLastVisitedCategory(userId, categoryId);
        console.log('Last visited category updated successfully');
        res.status(200).json({ success: true, message: 'Last visited category updated successfully.' });
    } catch (error) {
        console.error('Error updating last visited category:', error);
        res.status(500).json({ success: false, message: 'Failed to update last visited category.' });
    }
};

exports.addProductVisit = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;

    try {
        await UserActivityService.addProductVisit(userId, productId);
        res.status(200).json({ success: true, message: 'Product visit recorded successfully.' });
    } catch (error) {
        console.error('Error recording product visit:', error);
        res.status(500).json({ success: false, message: 'Failed to record product visit.' });
    }
};

exports.addSearchHistory = async (req, res) => {
    const userId = req.user._id;
    const { query, interactedProductId, interactedStoreId } = req.body;

    try {
        await UserActivityService.addSearchHistory(
            userId,
            query,
            interactedProductId || null,
            interactedStoreId || null
        );
        res.status(200).json({ success: true, message: 'Search history updated successfully.' });
    } catch (error) {
        console.error('Error adding search history:', error);
        res.status(500).json({ success: false, message: 'Failed to add search history.' });
    }
};



exports.addStoreView = async (req, res) => {
    const userId = req.user._id;
    const { storeId } = req.body;

    try {
        await UserActivityService.addStoreView(userId, storeId);
        res.status(200).json({ success: true, message: 'Store view recorded successfully.' });
    } catch (error) {
        console.error('Error recording store view:', error);
        res.status(500).json({ success: false, message: 'Failed to record store view.' });
    }
};

exports.getRecentlyViewedProducts = async (req, res) => {
    const userId = req.user._id;

    try {
        const userActivity = await UserActivityModel.findOne({ userId })
            .populate({
                path: 'lastVisitedProducts.productId',
                match: { inStock: true }, // Include only in-stock products
                populate: {
                    path: 'store',
                    select: 'storeName logo',
                },
            })
            .exec();

        if (!userActivity || !userActivity.lastVisitedProducts) {
            return res.status(200).json({ success: true, products: [] });
        }

        const recentlyViewedProducts = userActivity.lastVisitedProducts
            .filter((item) => item.productId) // Ensure productId exists and matches inStock criteria
            .map((item) => ({
                productId: item.productId._id,
                ...item.productId._doc,
                visitedAt: item.visitedAt,
            }));

        res.status(200).json({ success: true, products: recentlyViewedProducts });
    } catch (error) {
        console.error('Error fetching recently viewed products:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch recently viewed products' });
    }
};
