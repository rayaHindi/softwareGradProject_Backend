const OrderServices = require('../services/order.services');

exports.placeOrder = async (req, res) => {
    try {
        const userId = req.user._id; // Extracted from middleware
        console.log('userId');
        console.log(userId);

        const order = await OrderServices.placeOrder(userId);

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const userId = req.user._id; // Extracted from middleware
        console.log('userId');
        console.log(userId);

        const orders = await OrderServices.getOrdersByUserId(userId);

        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
