const ProductModel = require("../model/product.model");

class ProductServices {
    // Add a new product
    static async addProduct(productData) {
        try {
            // Validate availableOptions format and set default values
            if (productData.availableOptions) {
                for (const [key, values] of Object.entries(productData.availableOptions)) {
                    if (!Array.isArray(values)) {
                        throw new Error(
                            `Invalid availableOptions format: '${key}' must have an array of values`
                        );
                    }
    
                    // Ensure each option has an extraCost field, defaulting to 0
                    productData.availableOptions[key] = values.map(option => {
                        if (!option.name) {
                            throw new Error(`Each option in '${key}' must have a valid name.`);
                        }
                        return {
                            name: option.name.trim(),
                            extraCost: Math.max(0, parseFloat(option.extraCost) || 0), // Ensure non-negative
                        };
                    });
                }
            }
    
            // Validate and set availableOptionStatus
            if (productData.availableOptionStatus) {
                if (typeof productData.availableOptionStatus !== "object") {
                    throw new Error(
                        "Invalid availableOptionStatus format: Must be an object with boolean values."
                    );
                }
    
                for (const [key, value] of Object.entries(productData.availableOptionStatus)) {
                    if (typeof value !== "boolean") {
                        throw new Error(
                            `Invalid value in availableOptionStatus: '${key}' must be true or false.`
                        );
                    }
                }
            } else {
                productData.availableOptionStatus = {}; // Default to empty object
            }
    
            // Create and save the new product
            const newProduct = new ProductModel(productData);
            await newProduct.save();
            return newProduct;
        } catch (err) {
            throw new Error("Error adding product: " + err.message);
        }
    }
    
    

    // Get all products
    static async getAllProducts() {
        try {
            return await ProductModel.find(); // Fetch all products from the database
        } catch (err) {
            throw new Error("Error fetching products: " + err.message);
        }
    }

    // Get product by ID
    static async getProductById(productId) {
        try {
            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }
            return product;
        } catch (err) {
            throw new Error("Error fetching product: " + err.message);
        }
    }

    // Update a product by ID
    static async updateProductById(productId, updateData) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                productId,
                updateData,
                { new: true, runValidators: true }
            );
            if (!updatedProduct) {
                throw new Error("Product not found");
            }
            return updatedProduct;
        } catch (err) {
            throw new Error("Error updating product: " + err.message);
        }
    }

    // Delete a product by ID
    static async deleteProductById(productId) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(productId);
            if (!deletedProduct) {
                throw new Error("Product not found");
            }
            return deletedProduct;
        } catch (err) {
            throw new Error("Error deleting product: " + err.message);
        }
    }

    // Get all products by category
    static async getProductsByCategory(category) {
        try {
            return await ProductModel.find({ category });
        } catch (err) {
            throw new Error("Error fetching products by category: " + err.message);
        }
    }
}

module.exports = ProductServices;
