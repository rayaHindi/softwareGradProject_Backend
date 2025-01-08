const CartServices = require('../services/cart.services');

exports.addItem = async (req, res) => {
    try {
        const { productId, storeId, quantity, selectedOptions, timeRequired, pricePerUnitWithOptionsCost } = req.body;
        const userId = req.user._id; // Extracted from middleware

        const cart = await CartServices.addItemToCart(
            userId,
            productId,
            storeId,
            quantity,
            selectedOptions,
            timeRequired,
            pricePerUnitWithOptionsCost
        );

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const response = await CartServices.getCartByUserId(userId); // Already returns { success: true, cart }

        // Directly use the returned response
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity,selectedOptions } = req.body;
        const userId = req.user._id; // Extracted from middleware

        // Call the service function
        const updatedCart = await CartServices.updateCartItem(userId, productId, quantity, selectedOptions);

        res.status(200).json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeOrderedItems = async (req, res) => {
    const { productIds } = req.body; // Array of product IDs to remove
    const userId = req.user._id;

    try {
        const updatedCart = await CartServices.removeOrderedItems(userId, productIds);
        res.status(200).json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error('Error removing ordered items from cart:', error);
        res.status(500).json({ success: false, message: 'Failed to update cart' });
    }
};

