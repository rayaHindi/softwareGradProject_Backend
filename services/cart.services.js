const CartModel = require('../model/cart.model');
const ProductModel = require('../model/product.model');
class CartServices {
    // Add an item to the cart
    static async addItemToCart(userId, productId, storeId, quantity, selectedOptions, timeRequired) {
        try {
            let cart = await CartModel.findOne({ userId });

            if (!cart) {
                // If no cart exists, create a new one
                cart = new CartModel({
                    userId,
                    items: [],
                    totalPrice: 0,
                });
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            const existingItem = cart.items.find(
                (item) => item.productId.toString() === productId
            );

            if (existingItem) {
                // Update the quantity and selected options if the item already exists
                existingItem.quantity += quantity;
                existingItem.selectedOptions = selectedOptions;
                existingItem.timeRequired = timeRequired || product.timeRequired || 0;
            } else {
                // Add a new item to the cart
                cart.items.push({
                    productId,
                    storeId,
                    quantity,
                    selectedOptions,
                    timeRequired: timeRequired || product.timeRequired || 0,
                });
            }

            // Recalculate total price
            cart.totalPrice = cart.items.reduce(
                (total, item) =>
                    total + item.quantity * product.price, // Use product price
                0
            );

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw new Error('Unable to add item to cart');
        }
    }

  // Fetch the user's cart with cleaned response
// Fetch the user's cart with full product information
static async getCartByUserId(userId) {
    try {
        const cart = await CartModel.findOne({ userId })
            .populate('items.productId') // Populate the entire product object
            .populate('items.storeId', 'storeName'); // Populate only necessary fields for store

        if (!cart) {
            return { success: true, cart: { items: [] } }; // Return empty cart if not found
        }

        // Structure the cart response
        const cleanedCart = {
            _id: cart._id,
            userId: cart.userId,
            totalPrice: cart.totalPrice,
            items: cart.items.map(item => ({
                productId: item.productId, // Return the entire product object
                storeId: {
                    _id: item.storeId?._id,
                    storeName: item.storeId?.storeName,
                },
                quantity: item.quantity,
                selectedOptions: item.selectedOptions,
                timeRequired: item.timeRequired,
            })),
        };

        return { success: true, cart: cleanedCart };
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw new Error('Unable to fetch cart');
    }
}


    // Remove an item from the cart
    static async removeItemFromCart(userId, productId) {
        try {
            const cart = await CartModel.findOne({ userId });

            if (!cart) {
                throw new Error('Cart not found');
            }

            cart.items = cart.items.filter(
                (item) => item.productId.toString() !== productId
            );

            // Recalculate total price
            cart.totalPrice = cart.items.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error removing item from cart:', error);
            throw new Error('Unable to remove item from cart');
        }
    }
}

module.exports = CartServices;
