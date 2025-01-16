// controllers/specialOrderController.js
const SpecialOrderModel = require('../model/specialOrderModels/specialOrder.model');
const StoreSpecialOrderOptionModel = require('../model/specialOrderModels/storeSpecialOrderOption.model');
const mongoose = require('mongoose');
const calculateOrderPrice = require('../utils/calculateOrderPrice'); // Ensure this utility is correctly implemented

// Create a new Special Order
exports.createSpecialOrder = async (req, res) => {
    try {
        const { optionId, formData, estimatedPrice, status } = req.body;

        // Validate required fields
        if (!optionId || !formData || typeof estimatedPrice !== 'number') {
            return res.status(400).json({ message: 'Invalid order data.' });
        }

        // Validate optionId
        if (!mongoose.Types.ObjectId.isValid(optionId)) {
            return res.status(400).json({ message: 'Invalid optionId.' });
        }

        // Fetch the storeSpecialOrderOption to get storeId and other details
        const option = await StoreSpecialOrderOptionModel.findById(optionId);
        if (!option) {
            return res.status(404).json({ message: 'Special Order Option not found.' });
        }

        const storeId = option.storeId; // Assuming StoreSpecialOrderOptionModel has a storeId field

        // Assume customerId is obtained from the authenticated user
        const customerId = req.user._id; // Ensure your authentication middleware sets req.user

        const selectedCustomFields = [];
        let subtotal = 0.0;

        // Iterate through each field in formData
        for (const [fieldId, value] of Object.entries(formData)) {
            // Find the corresponding field in the option's customFields
            const customField = option.customFields.find(cf => cf.id === fieldId);
            if (!customField) {
                continue; // Skip unknown fields
            }

            let selectedOptions = [];
            let customValue = '';
            let extraCost = 0.0;

            switch (customField.type) {
                case 'dropdown':
                    if (value) {
                        selectedOptions = [value];
                        const selectedOption = customField.options.find(opt => opt.value === value);
                        if (selectedOption && selectedOption.extraCost) {
                            extraCost += selectedOption.extraCost;
                        }
                    }
                    break;
                case 'checkbox':
                    if (Array.isArray(value)) {
                        selectedOptions = value;
                        value.forEach(val => {
                            const selectedOption = customField.options.find(opt => opt.value === val);
                            if (selectedOption && selectedOption.extraCost) {
                                extraCost += selectedOption.extraCost;
                            }
                        });
                    }
                    break;
                case 'text':
                case 'number':
                case 'date':
                    customValue = value.toString();
                    // Assuming these fields might have a base extra cost
                    if (customField.extraCost) {
                        extraCost += customField.extraCost;
                    }
                    break;
                case 'imageUpload':
                    customValue = value.toString(); // URL or path
                    // If image upload has an extra cost, handle it
                    if (customField.extraCost) {
                        extraCost += customField.extraCost;
                    }
                    break;
                default:
                    break;
            }

            selectedCustomFields.push({
                fieldId,
                selectedOptions,
                customValue,
                extraCost,
            });

            subtotal += extraCost;
        }

        // Calculate totalPrice based on subtotal and quantity
        // Assuming there's a quantity field in formData
        const quantityField = option.customFields.find(cf => cf.type === 'number');
        const quantity = quantityField ? parseFloat(formData[quantityField.id]) || 1.0 : 1.0;
        const totalPrice = subtotal * quantity;

        // Construct orderItems
        const orderItems = [
            {
                optionId,
                selectedCustomFields,
                requiresPhotoUpload: option.requiresPhotoUpload || false,
                photoUploadPrompt: option.photoUploadPrompt || '',
                photoUrl: formData.photoUpload || '',
                totalPrice,
            },
        ];

        // Create the Special Order
        const newOrder = new SpecialOrderModel({
            customerId,
            storeId,
            orderItems,
            status: status || 'Pending',
            estimatedPrice,
            totalPrice, // Initially set to estimatedPrice; can be updated upon confirmation
            notes: formData.notes || '', // Assuming notes are part of formData
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
        const storeId = req.user._id;

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

        // Debugging: Log the orders to verify structure
        console.log(`Special Orders: ${JSON.stringify(orders)}`);

        res.status(200).json({ specialOrders: orders }); // Removed extra array
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
        const validStatuses = ['Pending', 'In Progress', 'Confirmed', 'Completed', 'Cancelled'];
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


// Get all Special Orders for the authenticated user
exports.getUserSpecialOrders = async (req, res) => {
    try {
        const userId = req.user._id; // Ensure your auth middleware sets req.user correctly

        const orders = await SpecialOrderModel.find({ customerId: userId })
            .populate('storeId', 'storeName icon'); // Populate store details as needed

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching user special orders:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
