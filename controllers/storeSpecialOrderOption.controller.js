// controllers/storeSpecialOrderOptionController.js

const StoreSpecialOrderOptionModel = require('../model/specialOrderModels/storeSpecialOrderOption.model');
const mongoose = require('mongoose');

// Create a new Store Special Order Option
exports.createStoreSpecialOrderOption = async (req, res) => {
    try {
        const storeId = req.user._id;
        const { name, description, customFields, requiresPhotoUpload, photoUploadPrompt } = req.body;

        // Basic validation
        if (!storeId || !name) {
            return res.status(400).json({ message: 'storeId and name are required.' });
        }

        // Validate storeId
        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ message: 'Invalid storeId.' });
        }

        // Additional validations for customFields can be added here
        // For example, ensuring unique field labels, valid field types, etc.

        const newOption = new StoreSpecialOrderOptionModel({
            storeId,
            name,
            description,
            customFields,
            requiresPhotoUpload,
            photoUploadPrompt,
        });

        const savedOption = await newOption.save();
        res.status(201).json(savedOption);
    } catch (error) {
        console.error('Error creating Store Special Order Option:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get all Special Order Options for a specific store
exports.getStoreSpecialOrderOptions = async (req, res) => {
    try {
        const { storeId } = req.params;

        // Validate storeId
        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ message: 'Invalid storeId.' });
        }

        const options = await StoreSpecialOrderOptionModel.find({ storeId });

        res.status(200).json(options);
    } catch (error) {
        console.error('Error fetching Store Special Order Options:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Update an existing Store Special Order Option
exports.updateStoreSpecialOrderOption = async (req, res) => {
    try {
        const { optionId } = req.params;
        const { name, description, customFields } = req.body;

        // Validate optionId
        if (!mongoose.Types.ObjectId.isValid(optionId)) {
            return res.status(400).json({ message: 'Invalid optionId.' });
        }

        // Find the option
        const option = await StoreSpecialOrderOptionModel.findById(optionId);
        if (!option) {
            return res.status(404).json({ message: 'Store Special Order Option not found.' });
        }

        // Update fields if provided
        if (name) option.name = name;
        if (description) option.description = description;
        if (customFields) option.customFields = customFields;

        option.updatedAt = Date.now();

        const updatedOption = await option.save();
        res.status(200).json(updatedOption);
    } catch (error) {
        console.error('Error updating Store Special Order Option:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Delete a Store Special Order Option
exports.deleteStoreSpecialOrderOption = async (req, res) => {
    try {
        const { optionId } = req.params;

        // Validate optionId
        if (!mongoose.Types.ObjectId.isValid(optionId)) {
            return res.status(400).json({ message: 'Invalid optionId.' });
        }

        const option = await StoreSpecialOrderOptionModel.findById(optionId);
        if (!option) {
            return res.status(404).json({ message: 'Store Special Order Option not found.' });
        }

        await option.remove();
        res.status(200).json({ message: 'Store Special Order Option deleted successfully.' });
    } catch (error) {
        console.error('Error deleting Store Special Order Option:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
