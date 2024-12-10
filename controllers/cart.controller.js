const CartServices = require('../services/cart.services');

exports.addItem = async (req, res) => {
    try {
        const { productId, storeId, quantity, selectedOptions, timeRequired } = req.body;
        const userId = req.user._id; // Extracted from middleware

        const cart = await CartServices.addItemToCart(
            userId,
            productId,
            storeId,
            quantity,
            selectedOptions,
            timeRequired
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
        const { productId, quantity } = req.body;
        const userId = req.user._id; // Extracted from middleware

        const updatedCart = await CartServices.updateCartItem(userId, productId, quantity);

        res.status(200).json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id; // Extracted from middleware

        const updatedCart = await CartServices.removeItemFromCart(userId, productId);

        res.status(200).json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
