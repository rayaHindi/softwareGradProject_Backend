const OrderModel = require('../model/order.model');
const StoreModel = require('../model/store.model');

class OrderServices {

    static async createOrder(orderData) {
        try {
            const orderNumbers = new Map(); // To store the order numbers for each store

            // Identify unique store IDs in the order items
            const storeIds = [...new Set(orderData.items.map((item) => item.storeId.toString()))];

            // Increment `numberOfReceivedOrders` for each store and store the result
            for (const storeId of storeIds) {
                const store = await StoreModel.findByIdAndUpdate(
                    storeId,
                    { $inc: { numberOfReceivedOrders: 1 } },
                    { new: true, useFindAndModify: false }
                );

                if (!store) {
                    throw new Error(`Store not found for ID: ${storeId}`);
                }

                // Save the updated number in the map
                orderNumbers.set(storeId, store.numberOfReceivedOrders);
            }

            // Add the `orderNumbers` map to the order data
            orderData.orderNumbers = Object.fromEntries(orderNumbers);

            // Save the order
            const order = new OrderModel(orderData);
            return await order.save();
        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Unable to create order');
        }
    }
    static async getOrdersByStoreId(storeId) {
        try {
            const orders = await OrderModel.find({ 'items.storeId': storeId })
                .populate('userId', 'name email') // Populate user details
                .populate('items.productId', 'name image'); // Populate product details
    
            // Filter and format the orders for the given store
            const formattedOrders = orders.map((order) => {
                const filteredItems = order.items.filter(
                    (item) => item.storeId.toString() === storeId
                );
    
                // Ensure orderNumbers is properly converted if it's a Map
                const orderNumbers = order.orderNumbers instanceof Map
                    ? Object.fromEntries(order.orderNumbers)
                    : order.orderNumbers;
    
                return {
                    orderId: order._id,
                    orderNumber: orderNumbers[storeId], // Retrieve the order number for this store
                    userId: order.userId,
                    deliveryDetails: order.deliveryDetails,
                    status: order.status,
                    createdAt: order.createdAt,
                    items: filteredItems.map((item) => ({
                        ...item.toObject(),
                        //productName: item.productId?.productName, // Include product name
                      //  productImage: item.productId?.image, // Include product image
                    })),
                    totalPrice: filteredItems.reduce(
                        (sum, item) => sum + item.totalPriceWithQuantity,
                        0
                    ),
                };
            });
    
            console.log("Formatted Orders:", JSON.stringify(formattedOrders, null, 2)); // Log the complete response
            return formattedOrders;
        } catch (error) {
            console.error('Error fetching orders for store:', error.message);
            throw new Error('Failed to fetch orders for the store');
        }
    }
    



    // Fetch orders by user ID
    static async getUserOrders(userId) {
        try {
            const orders = await OrderModel.find({ userId })
                .populate('items.productId', 'name image')
                .populate('items.storeId', 'storeName logo');
    
            // Ensure `storeId` keys are serialized properly as JSON-compatible objects
            for (const order of orders) {
                for (const item of order.items) {
                    if (item.storeId) {
                        // Correctly serialize as JSON-compatible structure
                        item.storeId = {
                            _id: item.storeId._id.toString(),
                            storeName: item.storeId.storeName,
                            logo: item.storeId.logo,
                        };
                    }
                }
            }
            console.log(orders);
    
            return orders;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw new Error('Failed to fetch user orders');
        }
    }
    
    

    // Update order status
    static async updateOrderStatus(orderId, status) {
        try {
            return await OrderModel.findByIdAndUpdate(
                orderId,
                { status },
                { new: true } // Return updated document
            );
        } catch (error) {
            console.error('Error updating order status:', error);
            throw new Error('Failed to update order status');
        }
    }
}

module.exports = OrderServices;
