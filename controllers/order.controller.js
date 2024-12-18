const OrderServices = require('../services/order.services');
const StoreModel = require('../model/store.model');
const OrderModel = require('../model/order.model');

exports.placeOrder = async (req, res) => {
    const userId = req.user._id; // Extracted from authentication middleware
    const { items, totalPrice, deliveryDetails } = req.body;

    try {
        // Step 1: Extract unique store IDs from items
        const uniqueStoreIds = [...new Set(items.map((item) => item.storeId.toString()))];

        // Step 2: Increment `numberOfReceivedOrders` for each unique store
        const orderNumbers = {}; // To store the order numbers for each store
        for (const storeId of uniqueStoreIds) {
            const store = await StoreModel.findByIdAndUpdate(
                storeId,
                { $inc: { numberOfReceivedOrders: 1 } },
                { new: true }
            );

            if (!store) {
                throw new Error(`Store with ID ${storeId} not found`);
            }

            orderNumbers[storeId] = store.numberOfReceivedOrders; // Track order number for the store
        }

        // Step 3: Assign the `orderNumbers` field to the order
        const orderData = {
            userId,
            items,
            totalPrice,
            deliveryDetails,
            orderNumbers, // Add order numbers to the order
        };

        // Step 4: Create the order in the database
        const order = new OrderModel(orderData);
        await order.save();

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ success: false, message: 'Failed to place order' });
    }
};





exports.getOrdersByStoreId = async (req, res) => {
    const storeId = req.user._id;
    console.log(`store id : ${storeId}`)

    try {
        const orders = await OrderServices.getOrdersByStoreId(storeId);
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders by store ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
};

exports.getUserOrders = async (req, res) => {
    const userId = req.user._id;

    try {
        const orders = await OrderServices.getUserOrders(userId);
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const updatedOrder = await OrderServices.updateOrderStatus(orderId, status);
        res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
};
