const ProductModel = require("../model/product.model");
const StoreModel = require("../model/store.model");
const mongoose = require('mongoose');


class ProductServices {
    // Adda a new product
    static async addProduct(productData, storeId) {
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
    
            // Validate storeId
            if (!mongoose.Types.ObjectId.isValid(storeId)) {
                throw new Error('Invalid store ID');
            }
    
            // Find the store by its ID
            const store = await StoreModel.findById(storeId);
            if (!store) {
                throw new Error('Store not found');
            }
            productData.category = store.category;
            // Create and save the new product with an explicit reference to the store
            const newProduct = new ProductModel({
                ...productData,
                store: storeId // Explicitly set the store reference in the product
            });
            await newProduct.save();
    
            // Add the new product to the store's list of products
            store.products.push(newProduct._id);
            await store.save();
    
            return newProduct;
        } catch (err) {
            throw new Error("Error adding product: " + err.message);
        }
    }
    
     // Update a product by ID
static async updateProductById(productId, updateData) {
    try {
        // Validate availableOptions format and set default values
        if (updateData.availableOptions) {
            for (const [key, values] of Object.entries(updateData.availableOptions)) {
                if (!Array.isArray(values)) {
                    throw new Error(
                        `Invalid availableOptions format: '${key}'`
                    );
                }

                // Ensure each option has an extraCost field, defaulting to 0
                updateData.availableOptions[key] = values.map(option => {
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
        if (updateData.availableOptionStatus) {
            if (typeof updateData.availableOptionStatus !== "object") {
                throw new Error(
                    "Invalid availableOptionStatus format: Must be an object with boolean values."
                );
            }

            for (const [key, value] of Object.entries(updateData.availableOptionStatus)) {
                if (typeof value !== "boolean") {
                    throw new Error(
                        `Invalid value in availableOptionStatus: '${key}' must be true or false.`
                    );
                }
            }
        } else {
            updateData.availableOptionStatus = {}; // Default to empty object if not provided
        }

        // Perform the update
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
          // Log the ID to ensure it's being passed correctly
          console.log("ProductService: Deleting product with ID:", productId);
          
          const deletedProduct = await ProductModel.findByIdAndDelete(productId);
          return deletedProduct; // Returns the deleted product if it existed, otherwise null
        } catch (err) {
          throw new Error("Error deleting product: " + err.message);
        }
      }
    
    // Remove product reference from store
static async removeProductFromStore(storeId, productId) {
    try {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Store not found");
      }
      // Remove the product ID from the store's products list
      store.products = store.products.filter(
        (id) => id.toString() !== productId.toString()
      );
      await store.save();
    } catch (err) {
      throw new Error("Error updating store: " + err.message);
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

    static async getProductsByStoreId(storeId) {
        try {
            // Query the products by `store` field that references the store ID
            return await ProductModel.find({ store: storeId });
        } catch (err) {
            console.log("Error fetching products by store ID: " + err.message);
            throw new Error("Error fetching products by store ID: " + err.message);
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

     // Get all products
     static async getAllProducts() {
        try {
            return await ProductModel.find(); // Fetch all products from the database
        } catch (err) {
            throw new Error("Error fetching products: " + err.message);
        }
    }

}


module.exports = ProductServices;
