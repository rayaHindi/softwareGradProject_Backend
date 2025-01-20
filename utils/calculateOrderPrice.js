// utils/calculateOrderPrice.js

const StoreSpecialOrderOptionModel = require('../model/specialOrderModels/storeSpecialOrderOption.model');
// utils/calculateOrderPrice.js
/**
 * Calculates the total price of the order based on selected options and their extra costs.
 * @param {Array} orderItems - Array of order items.
 * @returns {Number} - Total price of the order.
 */
const calculateOrderPrice = async (orderItems) => {
    let orderTotalPrice = 0;

    for (let item of orderItems) {
        const { optionId, selectedCustomFields, requiresPhotoUpload } = item;

        // Fetch the corresponding storeSpecialOrderOption
        const option = await StoreSpecialOrderOptionModel.findById(optionId);
        if (!option) {
            throw new Error(`Option with ID ${optionId} not found.`);
        }

        let itemTotalPrice = 0;

        // Iterate through custom fields to calculate extra costs
        for (let field of selectedCustomFields) {
            const { fieldId, selectedOptions: selectedOpts, customValue } = field;

            // Find the corresponding custom field in the option
            const customField = option.customFields.find(cf => cf.id === fieldId);
            if (!customField) {
                throw new Error(`Custom field with ID ${fieldId} not found in option ${optionId}.`);
            }

            if (customField.type === 'dropdown' || customField.type === 'checkbox') {
                if (Array.isArray(selectedOpts)) {
                    for (let selectedOpt of selectedOpts) {
                        const fieldOption = customField.options.find(o => o.value === selectedOpt);
                        if (fieldOption) {
                            itemTotalPrice += fieldOption.extraCost;
                        }
                    }
                } else if (typeof selectedOpts === 'string') {
                    const fieldOption = customField.options.find(o => o.value === selectedOpts);
                    if (fieldOption) {
                        itemTotalPrice += fieldOption.extraCost;
                    }
                }
            } else {
                // For text, number, date, imageUpload types, handle as needed
                if (customField.extraCost) {
                    itemTotalPrice += customField.extraCost;
                }
            }
        }

        // If photo upload is required, add a fixed extra cost (e.g., $10)
        if (requiresPhotoUpload) {
            itemTotalPrice += 10.0; // Adjust this value as per your pricing strategy
        }

        // Optionally, add base price for the option here if applicable
        // e.g., itemTotalPrice += option.basePrice;

        // Assign the calculated total price to the item
        item.totalPrice = itemTotalPrice;

        orderTotalPrice += itemTotalPrice;
    }

    return orderTotalPrice;
};

module.exports = calculateOrderPrice;
