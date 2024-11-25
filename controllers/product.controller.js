const ProductServices = require('../services/product.services.js');

exports.addNewProduct = async (req, res) => {
    try {
        // Log the request body for debugging
        console.log("Request Body:", req.body);

        // Use the ProductServices to add a product
        const product = await ProductServices.addProduct(req.body);

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
        console.log("Products returned successfully:", products);
        // Send the products back as a JSON response
        res.status(200).json(products);
    } catch (error) {
        console.error("Error getting all products:", error.message);

        // Send an error response
        res.status(400).json({ message: error.message });
    }
};