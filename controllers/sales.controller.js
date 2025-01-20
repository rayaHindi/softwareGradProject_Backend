// controllers/salesController.js
const Sale = require('../model/sales.model');
const ProductServices = require('../services/product.services.js');
// Create a new sale

exports.createSale = async (req, res) => {
    console.log("Inside createSale");

    try {
        const { productIds, saleType, saleAmount, startDate, endDate, sendPushNotification } = req.body;

        // Save the sale in the database
        const sale = new Sale({
            productIds,
            saleType,
            saleAmount,
            startDate,
            endDate,
            sendPushNotification,
        });

        console.log('Saving sale:', sale);
        const savedSale = await sale.save();
        console.log('Sale saved:', savedSale);

        // After sale is saved, update products
        const updateResults = [];

        // Loop through each productId and update its sale-related fields
        for (let productId of productIds) {
            // Fetch the product to get the price before applying sale
            const product = await ProductServices.getProductById(productId);
            if (!product) {
                console.log(`Product ${productId} not found, skipping.`);
                continue;
            }
            console.log(product.price); // Automatically returns salePrice if on sale

            if (product.inStock == true) {
                // Calculate the sale price using the formula: salePrice = saleAmount * product price
                salePrice = (saleAmount / 100) * product.price; // saleAmount is a percentage
                salePrice = product.price - salePrice;
                const updateData = {
                    onSale: true,
                    salePrice: salePrice, // Calculate and update sale price
                    saleAmount: saleAmount,
                    endDate: endDate,
                    oldPrice: product.price,
                    price: salePrice,
                };

                try {
                    // Call the updateProduct method (make sure to include store validation)
                    const updatedProduct = await ProductServices.updateProductById(productId, updateData);
                    updateResults.push(updatedProduct);
                    console.log(`Product ${productId} updated successfully.`);
                } catch (error) {
                    console.error(`Error updating product ${productId}:`, error.message);
                }

            }

        }

        // Return success response with the sale details and product update results
        res.status(201).json({
            sale: savedSale,
            updatedProducts: updateResults,
        });

    } catch (error) {
        // Rollback the transaction in case of any error
        console.error("Error creating sale or updating products:", error.message);

        // Return error response
        res.status(500).json({ error: error.message });
    }
};

// Get all sales
exports.getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find().populate('productIds');
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific sale by ID
exports.getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id).populate('productIds');
        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a sale by ID
exports.updateSale = async (req, res) => {
    try {
        const { productIds, saleType, saleAmount, startDate, endDate, sendPushNotification } = req.body;

        const sale = await Sale.findByIdAndUpdate(
            req.params.id,
            { productIds, saleType, saleAmount, startDate, endDate, sendPushNotification },
            { new: true } // Return the updated sale
        );

        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a sale by ID
exports.deleteSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndDelete(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
