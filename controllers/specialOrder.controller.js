// controllers/specialOrderController.js

const SpecialOrderModel = require('../model/specialOrderModels/specialOrder.model');
const StoreSpecialOrderOptionModel = require('../model/specialOrderModels/storeSpecialOrderOption.model');
const mongoose = require('mongoose');
const calculateOrderPrice = require('../utils/calculateOrderPrice'); // Utility function

// Create a new Special Order
exports.createSpecialOrder = async (req, res) => {
    try {
        const { customerId, storeId, orderItems, notes } = req.body;

        // Validate required fields
        if (!customerId || !storeId || !orderItems || !Array.isArray(orderItems)) {
            return res.status(400).json({ message: 'Invalid order data.' });
        }

        // Validate customerId and storeId
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(400).json({ message: 'Invalid customerId.' });
        }

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ message: 'Invalid storeId.' });
        }

        // Calculate total price
        const orderTotalPrice = await calculateOrderPrice(orderItems);

        const newOrder = new SpecialOrderModel({
            customerId,
            storeId,
            orderItems,
            notes,
            totalPrice: orderTotalPrice,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating Special Order:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get all Special Orders for a specific store
exports.getStoreSpecialOrders = async (req, res) => {
    try {
        const { storeId } = req.params;

        // Validate storeId
        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ message: 'Invalid storeId.' });
        }

        const orders = await SpecialOrderModel.find({ storeId })
            .populate('customerId', 'name email') // Adjust fields as needed
            .populate({
                path: 'orderItems.optionId',
                model: 'storeSpecialOrderOption',
                populate: {
                    path: 'customFields',
                },
            });

        res.status(200).json(orders);
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
exports.updateSpecialOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate orderId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'Invalid orderId.' });
        }

        // Validate status
        const validStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
        }

        const order = await SpecialOrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Special Order not found.' });
        }

        order.status = status;
        order.updatedAt = Date.now();

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating Special Order status:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
