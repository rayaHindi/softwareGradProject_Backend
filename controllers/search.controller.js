const ProductModel = require('../model/product.model');
const StoreModel = require('../model/store.model');
const UserActivityModel = require ('../model/userActivity.model');
const UserModel = require ('../model/user.model');

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
exports.getSuggestedProducts = async (req, res) => {
    const userId = req.user._id;

    try {
        // Fetch products from search history
        const userActivity = await UserActivityModel.findOne({ userId });
        const searchedProducts = userActivity?.searchHistory
            ?.filter((history) => history.interactedProduct)
            .map((history) => history.interactedProduct) || [];

        // Fetch products from wishlist
        const user = await UserModel.findById(userId).populate('wishlist');
        const wishlistProducts = user?.wishlist.filter((product) => product.inStock) || [];

        // Fetch top-selling products
        const bestSellingProducts = await ProductModel.find({ inStock: true })
            .sort({ salesCount: -1 })
            .limit(10); // Allow up to 10 best sellers for flexibility

        const uniqueProductIds = new Set();
        const prioritizedProducts = [];

        // Add up to 5 searched products
        searchedProducts.forEach((productId) => {
            if (uniqueProductIds.size < 5 && !uniqueProductIds.has(productId)) {
                uniqueProductIds.add(productId);
                prioritizedProducts.push(productId);
            }
        });

        // Add up to 3 wishlist products
        wishlistProducts.forEach((product) => {
            if (uniqueProductIds.size < 8 && !uniqueProductIds.has(product._id)) {
                uniqueProductIds.add(product._id);
                prioritizedProducts.push(product._id);
            }
        });

        // Add at least 2 best-sellers
        bestSellingProducts.forEach((product) => {
            if (uniqueProductIds.size < 10 && !uniqueProductIds.has(product._id)) {
                uniqueProductIds.add(product._id);
                prioritizedProducts.push(product._id);
            }
        });

        // Fetch product details and populate store name and logo
        const suggestedProducts = await ProductModel.find({
            _id: { $in: Array.from(uniqueProductIds) },
            inStock: true, // Ensure the products are in stock
        }).populate({
            path: 'store', // Populate store details
            select: 'storeName logo', // Include store name and logo only
        });

        // Shuffle the products to create a dynamic display
        const shuffledProducts = suggestedProducts.sort(() => Math.random() - 0.5);

        res.status(200).json({ success: true, products: shuffledProducts });
    } catch (error) {
        console.error("Error fetching suggested products:", error);
        res.status(500).json({ success: false, message: "Failed to fetch suggested products" });
    }
};
