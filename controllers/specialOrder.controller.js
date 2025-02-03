// controllers/specialOrderController.js
const SpecialOrderModel = require('../model/specialOrderModels/specialOrder.model');
const StoreSpecialOrderOptionModel = require('../model/specialOrderModels/storeSpecialOrderOption.model');
const mongoose = require('mongoose');
const calculateOrderPrice = require('../utils/calculateOrderPrice'); // Ensure this utility is correctly implemented

// Create a new Special Order
// Create a new Special Order
exports.createSpecialOrder = async (req, res) => {
    try {
        const { optionId, selectedCustomFields, estimatedPrice, status, photoUpload } = req.body;

        // Validate input
        if (!mongoose.Types.ObjectId.isValid(optionId)) {
            return res.status(400).json({ message: 'Invalid optionId.' });
        }

        if (!Array.isArray(selectedCustomFields) || selectedCustomFields.length === 0) {
            return res.status(400).json({ message: 'Invalid selectedCustomFields data.' });
        }

        if (typeof estimatedPrice !== 'number' || estimatedPrice <= 0) {
            return res.status(400).json({ message: 'Invalid estimatedPrice.' });
        }

        // Fetch option details
        const option = await StoreSpecialOrderOptionModel.findById(optionId);
        if (!option) {
            return res.status(404).json({ message: 'Special Order Option not found.' });
        }

        const customerId = req.user._id; // Assume authentication middleware sets req.user
        const storeId = option.storeId;

        // Construct order items
        const orderItems = [
            {
                optionId,
                selectedCustomFields,
                photoUrl: photoUpload || '',
                estimatedPrice,
            },
        ];

        // Create and save the special order
        const newOrder = new SpecialOrderModel({
            customerId,
            storeId,
            orderItems,
            status: status || 'Pending',
            estimatedPrice,
        });

        const savedOrder = await newOrder.save();

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating Special Order:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};


exports.getStoreSpecialOrders = async (req, res) => {
    try {
        const storeId = req.user._id;

        // Validate storeId
        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ message: 'Invalid storeId.' });
        }

        // Fetch orders with populated references
        const orders = await SpecialOrderModel.find({ storeId })
            .populate('customerId', 'firstName lastName email') // Include customer details
            .populate({
                path: 'orderItems.optionId',
                model: 'storeSpecialOrderOption',
                select: 'name description', // Include the name and description of the option
            });

        // Format orders to include only necessary details
        const formattedOrders = orders.map(order => ({
            ...order.toObject(),
            orderItems: order.orderItems.map(item => ({
                optionName: item.optionId?.name || 'N/A', // Include the option name
                optionDescription: item.optionId?.description || '', // Include option description
                selectedCustomFields: item.selectedCustomFields.map(field => ({
                    label: field.label, // Include the field label
                    value: field.customValue || field.selectedOptions.join(', '), // Include the value
                })),
                totalPrice: item.totalPrice, // Include the total price for this item
                photoUrl: item.photoUrl || '', // Include photo URL if available
            })),
        }));

      // // console.log(formattedOrders); // Debugging formatted orders
        res.status(200).json({ specialOrders: formattedOrders });
    } catch (error) {
        console.error('Error fetching Special Orders:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};



// Get a specific Special Order by ID
exports.getSpecialOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Validate orderId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'Invalid orderId.' });
        }

        const order = await SpecialOrderModel.findById(orderId)
            .populate('customerId', 'name email')
            .populate({
                path: 'orderItems.optionId',
                model: 'storeSpecialOrderOption',
                populate: {
                    path: 'customFields',
                },
            });

        if (!order) {
            return res.status(404).json({ message: 'Special Order not found.' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching Special Order:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Update the status of a Special Order
// Update the status of a Special Order and set the real price
exports.updateSpecialOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, realPrice } = req.body;

        // Validate orderId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'Invalid orderId.' });
        }

        // Validate status
        const validStatuses = ['Pending', 'In Progress', 'Confirmed', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
        }

        const order = await SpecialOrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Special Order not found.' });
        }

        // Update order status
        order.status = status;

        // If the real price is provided, update it
        if (status === 'Confirmed' && typeof realPrice === 'number' && realPrice > 0) {
            order.totalPrice = realPrice; // Set the real price as the total price
        }

        order.updatedAt = Date.now();

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating Special Order status:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};



// Get all Special Orders for the authenticated user
exports.getUserSpecialOrders = async (req, res) => {
    try {
        const userId = req.user._id; // Ensure your auth middleware sets req.user correctly

        const orders = await SpecialOrderModel.find({ customerId: userId })
            .populate('storeId', 'storeName icon')
            .populate({
                path: 'orderItems.optionId', // Populate the optionId field
                select: 'name', // Only include the 'name' field
            }); // Populate store details as needed

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching user special orders:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.markAsPaid = async (req, res) => {
    const { specialOrderId } = req.params; // Extract special order ID from the route
    const { isPaid, paymentDetails, deliveryDetails } = req.body; // Extract fields from the request body

    try {
        // Fetch the order by ID
        const order = await SpecialOrderModel.findById(specialOrderId);
        if (!order) {
            return res.status(404).json({ message: 'Special order not found' });
        }

        // Update the isPaid flag, payment details, and delivery details
        order.ifPaid = isPaid ?? order.ifPaid; // Use existing value if not provided
        order.paymentDetails = paymentDetails || order.paymentDetails; // Use default if not provided
        order.deliveryDetails = deliveryDetails || order.deliveryDetails;

        // Update the status to "afterCheckout" if payment was successful
        if (isPaid) {
            order.status = 'afterCheckout';
        }

        await order.save(); // Save updated order to the database

        res.status(200).json({ 
            message: 'Special order marked as paid successfully.', 
            updatedOrder: order 
        });
    } catch (error) {
        console.error('Error marking special order as paid:', error);
        res.status(500).json({ message: 'Failed to mark special order as paid.' });
    }
};
