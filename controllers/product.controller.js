const ProductServices = require('../services/product.services.js');
const StoreServices = require('../services/store.services.js'); // You may create this if needed
const ProductModel = require("../model/product.model");

const mongoose = require('mongoose');

exports.addNewProduct = async (req, res) => {
    try {
        // Extract storeId from the authenticated user (from the middleware)
        const storeId = req.user._id;
        console.log("storeID:", storeId);

        // Log the request body for debugging
        console.log("Request Body:", req.body);

        // Use the ProductServices to add a product with the storeId passed separately
        const product = await ProductServices.addProduct(req.body, storeId);

        console.log("Product added successfully:", product);
        res.status(201).json(product);
    } catch (error) {
        console.error("Error adding product:", error.message);
        res.status(400).json({ message: error.message });
    }
};



exports.getAllProducts = async (req, res) => {
    try {
        // Fetch all products using the service
        const products = await ProductServices.getAllProducts();
        //console.log("Products returned successfully:", products);
        // Send the products back as a JSON response
        res.status(200).json(products);
    } catch (error) {
        console.error("Error getting all products:", error.message);

        // Send an error response
        res.status(400).json({ message: error.message });
    }
};


exports.updateProductsBatch = async (req, res) => {
    const { productUpdates } = req.body; // Expecting an array of objects { id, onSale, salePrice }

    try {
        // Validate the input
        if (!Array.isArray(productUpdates) || productUpdates.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty product updates list.' });
        }

        // Prepare bulk update operations
        const bulkOps = productUpdates.map((update) => {
            const { id, onSale, salePrice } = update;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid product ID: ${id}`);
            }

            return {
                updateOne: {
                    filter: { _id: id },
                    update: { $set: { onSale, salePrice, updatedAt: Date.now() } },
                },
            };
        });

        // Perform bulk write operation
        const result = await ProductServices.bulkUpdateProducts(bulkOps);

        res.status(200).json({
            message: 'Products updated successfully.',
            result,
        });
    } catch (error) {
        console.error('Error updating products in batch:', error.message);
        res.status(500).json({ message: error.message });
    }
};



exports.updateProduct = async (req, res) => {
    try {
        const storeId = req.user._id; // Extract store ID from the token payload
        const productId = req.body._id; // Extract the product ID from the request body
        const updateData = req.body;

        console.log("Updating Product with ID:", productId);
        console.log("Update Data:", updateData);

        // Check if the product belongs to the authenticated store
        const product = await ProductServices.getProductById(productId);
        if (!product || product.store.toString() !== storeId.toString()) {
            return res.status(403).json({ message: "Unauthorized to update this product" });
        }

        // Use ProductServices to update the product
        const updatedProduct = await ProductServices.updateProductById(productId, updateData);

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log("Product updated successfully:", updatedProduct);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const storeId = req.user._id; // Extract store ID from the token payload
        const productId = req.params.productId;

        console.log("Deleting Product with ID:", productId);

        // Use the service to get the product and verify if it belongs to the store
        const product = await ProductServices.getProductById(productId);
        if (!product || product.store.toString() !== storeId.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this product" });
        }

        // Use the service to delete the product
        const deletedProduct = await ProductServices.deleteProductById(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Remove the product reference from the store's products list
        await ProductServices.removeProductFromStore(storeId, productId);

        console.log("Product deleted successfully:", deletedProduct);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getProductsByStoreIdForOwner = async (req, res) => {
    try {
        console.log('in getProductsByStoreId for OWNER');
        const storeId = req.user._id;
        console.log('storeId: ', storeId);

        // Validate storeId
        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ status: false, message: 'Invalid store ID' });
        }

        // Fetch store details to get `allowSpecialOrders`
        const store = await StoreServices.getStoreById(storeId);
        if (!store) {
            return res.status(404).json({ status: false, message: 'Store not found' });
        }

        // Call the service method to fetch products by store ID
        const products = await ProductServices.getProductsByStoreId(storeId);
        console.log("Products fetched successfully: ", products);

        res.status(200).json({
            status: true,
            message: 'Products fetched successfully',
            data: {
                products,
                allowSpecialOrders: store.allowSpecialOrders, // Include `allowSpecialOrders`
            },
        });

    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({
            status: false,
            message: 'Failed to fetch products',
            error: err.message,
        });
    }
};


exports.getProductsByStoreIdForUsers = async (req, res) => {
    try {
        console.log('In getProductsByStoreId for users');
        const { storeId } = req.params; // Get storeId from request parameters
        console.log('storeId:', storeId);

        // Validate storeId
        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ status: false, message: 'Invalid store ID' });
        }

        // Call the service method to fetch products by store ID
        const products = await ProductServices.getProductsByStoreId(storeId);
        console.log("Products fetched successfully: ", products);
        res.status(200).json({
            status: true,
            message: 'Products fetched successfully',
            data: products,
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({
            status: false,
            message: 'Failed to fetch products',
            error: err.message,
        });
    }
};

// controllers/product.controller.js

exports.reduceQuantity = async (req, res) => {
    const { productId } = req.params; // Get product ID from route parameters
    const { quantity } = req.body;   // Get quantity from request body

    try {
        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Validate quantity
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity value' });
        }

        // Call the service to reduce product quantity
        const updatedProduct = await ProductServices.reduceProductQuantity(productId, quantity);

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product quantity updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error reducing product quantity:', error.message);
        res.status(500).json({ message: 'Error reducing product quantity', error: error.message });
    }
};
exports.getMostSearched = async (req, res) => {
    try {
        // Fetch most searched products and stores
        const topProducts = await ProductServices.getMostSearchedProducts();
        const topStores = await StoreServices.getMostSearchedStores();

        res.status(200).json({
            success: true,
            stores: topStores,
            products: topProducts,

        });
    } catch (error) {
        console.error('Error fetching most searched items:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.incrementSearchCount = async (req, res) => {
    try {
        const { id, type } = req.body;

        if (!id || !type) {
            return res.status(400).json({ success: false, message: 'Invalid parameters' });
        }

        if (type === 'product') {
            await ProductServices.incrementProductSearchCount(id);
        } else if (type === 'store') {
            await StoreServices.incrementStoreSearchCount(id);
        } else {
            return res.status(400).json({ success: false, message: 'Invalid type parameter' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error incrementing search count:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.rateProduct = async (req, res) => {
    try {
        const { products, orderId } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ error: 'Products array is required' });
        }

        const updatedProducts = await ProductServices.updateProductRatings(products, orderId);

        if (!updatedProducts) {
            return res.status(404).json({ error: 'One or more products not found' });
        }

        res.status(200).json({ message: 'Product ratings updated successfully', data: updatedProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
/*
exports.getStoreInsights = async (req, res) => {
    try {
        const { storeId } = req.params; // Get storeId from request parameters

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ status: false, message: 'Invalid store ID' });
        }

        // Fetch products for the store
        const products = await ProductModel.find({ store: storeId });

        if (!products.length) {
            return res.status(404).json({ status: false, message: 'No products found for this store' });
        }

        // Find most searched product
        const mostSearchedProduct = products.reduce((max, product) =>
            product.searchCount > (max?.searchCount || 0) ? product : max, null);

        // Find most ordered product
        const mostOrderedProduct = products.reduce((max, product) =>
            product.salesCount > (max?.salesCount || 0) ? product : max, null);

        // Send the insights
        res.status(200).json({
            status: true,
            message: 'Store insights fetched successfully',
            data: {
                mostSearchedProduct,
                mostOrderedProduct,
            },
        });
    } catch (err) {
        console.error('Error fetching store insights:', err);
        res.status(500).json({
            status: false,
            message: 'Failed to fetch store insights',
            error: err.message,
        });
    }
};
*/
/*
exports.getStoreInsights = async (req, res) => {
    try {
        const { storeId } = req.params; // Get storeId from request parameters

        // Validate storeId
        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ status: false, message: 'Invalid store ID' });
        }

        // Fetch products for the store
        const products = await ProductModel.find({ store: storeId }).lean();

        if (!products.length) {
            return res.status(404).json({ status: false, message: 'No products found for this store' });
        }

        // Find most searched product
        const mostSearchedProduct = products.reduce((max, product) =>
            product.searchCount > (max?.searchCount || 0) ? product : max, null);

        // Find most ordered product
        const mostOrderedProduct = products.reduce((max, product) =>
            product.salesCount > (max?.salesCount || 0) ? product : max, null);

        // Send the insights
        res.status(200).json({
            status: true,
            message: 'Store insights fetched successfully',
            data: {
                mostSearchedProduct: mostSearchedProduct
                    ? {
                        id: mostSearchedProduct._id,
                        name: mostSearchedProduct.name,
                        description: mostSearchedProduct.description,
                        price: mostSearchedProduct.price,
                        salePrice: mostSearchedProduct.salePrice,
                        image: mostSearchedProduct.image,
                        category: mostSearchedProduct.category,
                        searchCount: mostSearchedProduct.searchCount,
                        stock: mostSearchedProduct.stock,
                        inStock: mostSearchedProduct.inStock,
                        rating: mostSearchedProduct.rating,
                    }
                    : null,
                mostOrderedProduct: mostOrderedProduct
                    ? {
                        id: mostOrderedProduct._id,
                        name: mostOrderedProduct.name,
                        description: mostOrderedProduct.description,
                        price: mostOrderedProduct.price,
                        salePrice: mostOrderedProduct.salePrice,
                        image: mostOrderedProduct.image,
                        category: mostOrderedProduct.category,
                        salesCount: mostOrderedProduct.salesCount,
                        stock: mostOrderedProduct.stock,
                        inStock: mostOrderedProduct.inStock,
                        rating: mostSearchedProduct.rating,

                    }
                    : null,
            },
        });
    } catch (err) {
        console.error('Error fetching store insights:', err);
        res.status(500).json({
            status: false,
            message: 'Failed to fetch store insights',
            error: err.message,
        });
    }
};
*/