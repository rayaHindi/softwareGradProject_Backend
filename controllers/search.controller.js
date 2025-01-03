const ProductModel = require('../model/product.model');
const StoreModel = require('../model/store.model');

exports.incrementSearchCounts = async (req, res) => {
    const { productIds, storeIds } = req.body;

    try {
        if (productIds && productIds.length > 0) {
            await ProductModel.updateMany(
                { _id: { $in: productIds } },
                { $inc: { searchCount: 1 } }
            );
        }

        if (storeIds && storeIds.length > 0) {
            await StoreModel.updateMany(
                { _id: { $in: storeIds } },
                { $inc: { searchCount: 1 } }
            );
        }

        res.status(200).json({ success: true, message: 'Search counts updated successfully' });
    } catch (error) {
        console.error('Error updating search counts:', error);
        res.status(500).json({ success: false, message: 'Failed to update search counts' });
    }
};
