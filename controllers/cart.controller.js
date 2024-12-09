const CartServices = require('../services/cart.services');

exports.addItem = async (req, res) => {
    try {
        const { productId, storeId, quantity, price } = req.body;
        const userId = req.user._id; // Extracted from middleware
        console.log('userId');
        console.log(userId); // Assuming `req.user` contains the authenticated user's ID

        const cart = await CartServices.addItemToCart(userId, productId, storeId, quantity, price);

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id; // Extracted from middleware
        console.log('userId');
        console.log(userId);

        const cart = await CartServices.getCartByUserId(userId);

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id; // Extracted from middleware
        console.log('userId');
        console.log(userId);

        const cart = await CartServices.getCartByUserId(userId);

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.removeItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id; // Extracted from middleware
        console.log('userId');
        console.log(userId);

        const cart = await CartServices.removeItemFromCart(userId, productId);

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
