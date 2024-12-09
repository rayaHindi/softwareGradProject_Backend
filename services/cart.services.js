const CartModel = require('../model/cart.model');

class CartServices {
    // Add an item to the cart
    static async addItemToCart(userId, productId, storeId, quantity, price) {
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

            const existingItem = cart.items.find(
                (item) => item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, storeId, quantity });
            }

            // Update total price
            cart.totalPrice += price * quantity;

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw new Error('Unable to add item to cart');
        }
    }

    // Fetch the user's cart
    static async getCartByUserId(userId) {
        try {
            return await CartModel.findOne({ userId }).populate('items.productId');
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
