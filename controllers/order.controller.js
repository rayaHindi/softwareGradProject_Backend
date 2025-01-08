const OrderServices = require('../services/order.services');
const StoreModel = require('../model/store.model');
const OrderModel = require('../model/order.model');
const UserModel = require('../model/user.model'); // Import the User model
const ProductModel = require('../model/product.model');
exports.placeOrder = async (req, res) => {
    const userId = req.user._id; // Extracted from authentication middleware
    const { items, totalPrice, deliveryDetails, deliveryPreference, paymentDetails } = req.body;
    console.log('Payment Details:', paymentDetails);

    try {
        // Step 1: Validate items and required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Items are required' });
        }

        // Validate each item for the required fields
        for (const item of items) {
            const { productId, storeId, quantity, pricePerUnitWithOptionsCost, totalPriceWithQuantity, deliveryType } = item;

            if (!productId || !storeId || !quantity || !pricePerUnitWithOptionsCost || !totalPriceWithQuantity || !deliveryType) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid item structure. Ensure all required fields are provided.',
                });
            }

            if (deliveryType === 'scheduled' && item.timePickingAllowed) {
                if (!item.selectedDate || !item.selectedTime) {
                    return res.status(400).json({
                        success: false,
                        message: 'Scheduled deliveries with time picking allowed must include selectedDate and selectedTime.',
                    });
                }
            }
        }
        if (!paymentDetails || !paymentDetails.method) {
            return res.status(400).json({
                success: false,
                message: 'Payment details are required and must include a valid method.',
            });
        }


        // Step 2: Extract unique store IDs from items
        const uniqueStoreIds = [...new Set(items.map((item) => item.storeId.toString()))];
        console.log(`in placing order uniqueStoreIds: ${uniqueStoreIds}`);

        // Step 2.5: Increment salesCount for each product in the items
        for (const item of items) {
            const { productId, quantity } = item;

            // Increment salesCount by the quantity of the product in the order
            const product = await ProductModel.findByIdAndUpdate(
                productId,
                { $inc: { salesCount: quantity } },
                { new: true }
            );

            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }
        }

        // Step 3: Increment `numberOfReceivedOrders` for each unique store
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

        // Validate delivery preference
        if (!deliveryPreference || !['Deliver All Together', 'Deliver When Ready'].includes(deliveryPreference)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid delivery preference. Choose "Deliver All Together" or "Deliver When Ready".',
            });
        }

        // Step 4: Increment `numberOfOrders` for the user
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $inc: { numberOfOrders: 1 } }, // Increment the user's order count
            { new: true }
        );

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        const userOrderNumber = user.numberOfOrders; // Get the current order number for the user

        // Step 5: Validate and track store-level totals
        const storeTotals = {};
        items.forEach((item) => {
            const { storeId, storeTotal, storeDeliveryCost } = item;

            // Validate that storeTotal and storeDeliveryCost are provided
            if (typeof storeTotal !== 'number' || typeof storeDeliveryCost !== 'number') {
                throw new Error(`Invalid storeTotal or storeDeliveryCost for store ID ${storeId}`);
            }

            // Aggregate totals for each store
            if (!storeTotals[storeId]) {
                storeTotals[storeId] = {
                    productsTotal: 0,
                    deliveryCost: storeDeliveryCost,
                };
            }

            storeTotals[storeId].productsTotal += storeTotal;
        });

        // Step 6: Assign the `orderNumbers` and `storeTotals` field to the order
        const orderData = {
            userId,
            items: items.map((item) => {
                const {
                    productId,
                    storeId,
                    quantity,
                    pricePerUnitWithOptionsCost,
                    totalPriceWithQuantity,
                    selectedOptions,
                    deliveryType,
                    timePickingAllowed,
                    selectedDate,
                    selectedTime,
                    storeTotal,
                    storeDeliveryCost,
                } = item;

                // Include new fields for scheduled deliveries
                return {
                    productId,
                    storeId,
                    quantity,
                    pricePerUnitWithOptionsCost,
                    totalPriceWithQuantity,
                    selectedOptions,
                    deliveryType,
                    timePickingAllowed: timePickingAllowed || false, // Default to false if not provided
                    selectedDate: timePickingAllowed ? selectedDate : null,
                    selectedTime: timePickingAllowed ? selectedTime : null,
                    storeTotal,
                    storeDeliveryCost,
                };
            }),
            totalPrice,
            deliveryDetails,
            orderNumbers, // Add order numbers for each store
            userOrderNumber, // Include the user's order number
            storeTotals, // Include aggregated totals for each store
            deliveryPreference,
            paymentDetails,
        };

        // Step 7: Create the order in the database
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

exports.updateItemStatus = async (req, res) => {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    const storeId = req.user._id;

    try {
        const updatedOrder = await OrderServices.updateItemStatus(orderId, storeId, newStatus);
        res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error('Error updating item status:', error);
        res.status(500).json({ success: false, message: 'Failed to update item status' });
    }
};
