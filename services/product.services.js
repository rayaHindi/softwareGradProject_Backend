const ProductModel = require("../model/product.model");
const StoreModel = require("../model/store.model");

class ProductServices {
    // Adda a new product
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
    
            // Validate storeId
            const storeId = productData.storeId;
            if (!mongoose.Types.ObjectId.isValid(storeId)) {
                throw new Error('Invalid store ID');
            }
    
            // Find the store by its ID
            const store = await StoreModel.findById(storeId);
            if (!store) {
                throw new Error('Store not found');
            }
    
            // Create and save the new product
            const newProduct = new ProductModel(productData);
            await newProduct.save();
    
            // Add the new product to the store's list of products
            store.products.push(newProduct._id);
            await store.save();
    
            return newProduct;
        } catch (err) {
            throw new Error("Error adding product: " + err.message);
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
            // Find the store by the given storeId
            const store = await StoreModel.findById(storeId).populate('products');

            if (!store) {
                throw new Error("Store not found");
            }

            // Return the products array from the store
            return store.products;
        } catch (err) {
            throw new Error("Error fetching products by store ID: " + err.message);
        }
    }
}


module.exports = ProductServices;
