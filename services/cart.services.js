const CartModel = require('../model/cart.model');
const ProductModel = require('../model/product.model');
class CartServices {
    // Add an item to the cart
    static async addItemToCart(userId, productId, storeId, quantity, selectedOptions, timeRequired, pricePerUnitWithOptionsCost) {
        try {
            // Fetch cart and populate productId
            let cart = await CartModel.findOne({ userId })
                .populate('items.productId', 'deliveryType');
    
            if (!cart) {
                cart = new CartModel({
                    userId,
                    items: [],
                    InstantTotalPrice: 0,
                    ScheduledTotalPrice: 0,
                });
            }
    
            // Validate the pricePerUnitWithOptionsCost
            if (!pricePerUnitWithOptionsCost) {
                throw new Error('Price per unit with options cost is required');
            }
    
            // Check for existing item in the cart
            const existingItem = cart.items.find(
                (item) =>
                    item.productId.toString() === productId &&
                    JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
            );
    
            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.totalPriceWithQuantity =
                    existingItem.quantity * existingItem.pricePerUnitWithOptionsCost;
            } else {
                cart.items.push({
                    productId,
                    storeId,
                    quantity,
                    selectedOptions,
                    pricePerUnitWithOptionsCost,
                    totalPriceWithQuantity: quantity * pricePerUnitWithOptionsCost,
                    timeRequired: timeRequired || 0,
                });
            }
    
            console.log('Cart Items:', cart.items);
    
            // Recalculate totals
            cart.InstantTotalPrice = cart.items
                .filter((item) => item.productId?.deliveryType === 'instant')
                .reduce((total, item) => total + (item.totalPriceWithQuantity || 0), 0);
    
            cart.ScheduledTotalPrice = cart.items
                .filter((item) => item.productId?.deliveryType === 'scheduled')
                .reduce((total, item) => total + (item.totalPriceWithQuantity || 0), 0);
    
            console.log('InstantTotalPrice:', cart.InstantTotalPrice);
            console.log('ScheduledTotalPrice:', cart.ScheduledTotalPrice);
    
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
                //totalPrice: cart.totalPrice,
                InstantTotalPrice: cart.InstantTotalPrice,
                ScheduledTotalPrice: cart.ScheduledTotalPrice,
                items: cart.items.map(item => ({
                    productId: item.productId, // Return the entire product object
                    storeId: {
                        _id: item.storeId?._id,
                        storeName: item.storeId?.storeName,
                    },
                    quantity: item.quantity,
                    selectedOptions: item.selectedOptions,
                    timeRequired: item.timeRequired,
                    pricePerUnitWithOptionsCost: item.pricePerUnitWithOptionsCost,
                    totalPriceWithQuantity: item.totalPriceWithQuantity,

                })),
            };

            return { success: true, cart: cleanedCart };
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw new Error('Unable to fetch cart');
        }
    }


    static async updateCartItem(userId, productId, quantity, selectedOptions) {
        try {
            const cart = await CartModel.findOne({ userId });

            if (!cart) {
                throw new Error('Cart not found');
            }

            // Find the item in the cart by `productId` and `selectedOptions`
            const item = cart.items.find(
                (item) =>
                    item.productId.toString() === productId &&
                    JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
            );

            if (!item) {
                throw new Error('Item not found in cart');
            }

            // Update the quantity or remove the item if quantity is zero
            if (quantity > 0) {
                item.quantity = quantity;
                item.totalPriceWithQuantity = item.quantity * item.pricePerUnitWithOptionsCost; // Recalculate total price for the item
            } else {
                // Remove the specific item from the cart
                cart.items = cart.items.filter(
                    (item) =>
                        !(item.productId.toString() === productId &&
                            JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
                );
            }
            console.log('Cart Items after populate:', cart.items);

            // Recalculate totals separately
            cart.InstantTotalPrice = cart.items
                .filter((item) => item.productId.deliveryType === 'instant')
                .reduce((total, item) => total + item.totalPriceWithQuantity, 0);
            console.log('InstantTotalPrice', cart.InstantTotalPrice);

            cart.ScheduledTotalPrice = cart.items
                .filter((item) => item.productId.deliveryType === 'scheduled')
                .reduce((total, item) => total + item.totalPriceWithQuantity, 0);
            console.log('ScheduledTotalPrice', cart.ScheduledTotalPrice);

            // Save the updated cart
            await cart.save();

            // Return the updated cart with populated fields for better response
            return cart;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw new Error('Unable to update cart item');
        }
    }

}

module.exports = CartServices;
