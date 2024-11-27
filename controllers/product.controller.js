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

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.body._id; // Extract the product ID from the request body
        const updateData = req.body;

        // Log the product ID and update data for debugging purposes
        console.log("Updating Product with ID:", productId);
        console.log("Update Data:", updateData);

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
      const productId = req.params.productId;
  
      // Logging productId for debugging purposes
      console.log("Deleting Product with ID:", productId);
  
      // Use the service to delete the product
      const deletedProduct = await ProductServices.deleteProductById(productId);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      console.log("Product deleted successfully:", deletedProduct);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error.message);
      res.status(500).json({ message: error.message });
    }
  };