const OrderModel = require('../model/order.model');
const CartModel = require('../model/cart.model');

class OrderServices {
    // Place an order
    static async placeOrder(userId) {
        try {
            const cart = await CartModel.findOne({ userId }).populate(
                'items.productId'
            );

            if (!cart || cart.items.length === 0) {
                throw new Error('Cart is empty');
            }

            const order = new OrderModel({
                userId,
                items: cart.items,
                totalPrice: cart.totalPrice,
            });

            await order.save();

            // Clear the cart after order placement
            await CartModel.findOneAndDelete({ userId });

            return order;
        } catch (error) {
            console.error('Error placing order:', error);
            throw new Error('Unable to place order');
        }
    }

    // Fetch all orders for a user
    static async getOrdersByUserId(userId) {
        try {
            return await OrderModel.find({ userId }).populate('items.productId');
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Unable to fetch orders');
        }
    }
}

module.exports = OrderServices;
