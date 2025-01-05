//user.services.js
//In services, all the database operation happens like fetching, Insertion, Deletion.
const UserModel = require("../model/user.model");
const StoreModel = require("../model/store.model");
const CategoryModel =require("../model/category.model");
const ProductModel =require("../model/product.model");

const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

class UserServices {

    static async registerUser({ firstName, lastName, email, phoneNumber, password, accountType = 'U', selectedGenres = [] }) {
        try {
            // Create a new user with all the provided fields
            const createUser = new UserModel({
                firstName,
                lastName,
                email,
                phoneNumber,
                password,
                accountType,
                selectedGenres
            });

            // Save the new user to the database
            return await createUser.save();
        } catch (err) {
            // Handle and propagate any errors
            throw err;
        }
    }

    static async getUserByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (err) {
            console.log(err);
        }
    }
    static async findUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email });
            /*if (!user) {
                throw new Error('User not found');
            }*/
            return user;
        } catch (error) {
            throw error;
        }
    }
    static async getUserById(userId) {
        try {
            return await UserModel.findById(userId).select('-password'); // Exclude the password
        } catch (err) {
            throw err;
        }
    }
    static async checkUser(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }
    static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }//

    static async resetUserPassword(userId, newPassword) {
        try {
            // Find the user by ID
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Update the user's password
            user.password = newPassword; // This will trigger the pre-save hook to hash the password
            await user.save();

            return user;
        } catch (error) {
            throw error;
        }
    }


    static async resetUserPasswordWithOldPass(userId, oldPassword, newPassword) {
        try {
            // Find the user by ID
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Verify that the old password matches the hashed password in the database
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                throw new Error('Old password is incorrect');
            }

            // Hash the new password before saving it
            // const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password
            user.password = newPassword; // This will trigger the pre-save hook to hash the password
            await user.save();

            return user;
        } catch (error) {
            throw error;
        }
    }

    static async updateUserInfo(userId, updateData) {
        try {
            // Find the user by ID and update only the fields in updateData
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true } // true-> return new object  validators->check if data valid
            ).select('-password'); // Exclude password from the returned document

            // Check if the user was found and updated
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser; // Return the updated user
        } catch (error) {
            throw error; // Rethrow error to be handled in the controller
        }
    }
    static async addCreditCard(userId, cardDetails) {
        try {
            // Find the user by ID and update their credit card details
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Add or update the card details
            user.visaCard = cardDetails;

            // Save the updated user object
            await user.save();

            return user; // Return the updated user
        } catch (error) {
            throw error; // Rethrow the error to be handled in the controller
        }
    }
    static async getCreditCardData(userId) {
        try {
            // Find the user by ID and retrieve only the visaCard field
            const user = await UserModel.findById(userId).select('visaCard');

            if (!user) {
                throw new Error('User not found');
            }

            // Check if visaCard is null or undefined
            if (!user.visaCard) {
                return null; // Return null explicitly if no credit card data
            }

            // Return the credit card details
            return user.visaCard;
        } catch (error) {
            throw new Error('Error fetching credit card data: ' + error.message);
        }
    }
    static async getFullName(userId) {
        try {
            // Fetch user data by userId (or email, if you prefer)
            const user = await UserModel.findById(userId).select('firstName lastName');

            if (!user) {
                throw new Error('User not found');
            }

            // Combine firstName and lastName to get full name
            const fullName = `${user.firstName} ${user.lastName}`;
            return fullName;
        } catch (error) {
            throw error;
        }
    }
    /*
        static async addFavoriteStore(userId, storeId) {
            return await UserModel.findByIdAndUpdate(
                userId,
                { $addToSet: { favStores: storeId } }, // Prevent duplicates
                { new: true }
            );
        }
        static async removeFavoriteStore(userId, storeId) {
            try {
                return await UserModel.findByIdAndUpdate(
                    userId,
                    { $pull: { favStores: storeId } }, // Use $pull to remove the storeId from the favStores array
                    { new: true } // Return the updated user document
                );
            } catch (error) {
                throw error;
            }
        }
        */

    static async addToWishlist(userId, productId) {
        try {
            return await UserModel.findByIdAndUpdate(
                userId,
                { $addToSet: { wishlist: productId } }, // Prevent duplicates
                { new: true }
            );
        } catch (error) {
            throw error;
        }
    }
    static async removeFromWishlist(userId, productId) {
        try {
            return await UserModel.findByIdAndUpdate(
                userId,
                { $pull: { wishlist: productId } }, // Remove the productId from wishlist
                { new: true }
            );
        } catch (error) {
            throw error;
        }
    }
    static async checkIfInWishlist(userId, productId) {
        try {
            const user = await UserModel.findById(userId).select("wishlist");
            if (!user) throw new Error("User not found");
            return user.wishlist.includes(productId); // Check if product exists in wishlist
        } catch (error) {
            throw error;
        }
    }

    static async getWishList(userId) {
        try {
            const user = await UserModel.findById(userId)
                .populate({
                    path: 'wishlist', // Populate wishlist (assumes wishlist contains product IDs)
                    model: 'product',
                    populate: {
                        path: 'store', // Populate store details within each product
                        select: 'storeName logo', // Only include storeName and logo
                    },
                });

            console.log(user);


            if (!user) throw new Error("User not found");

            return user.wishlist.flat(); // Return the populated wishlist
        } catch (error) {
            throw error;
        }
    }
    static async getstoresOfFavCategories(userId) {
        try {
            // Fetch the user's selected categories or genres
            const user = await UserModel.findById(userId).select('selectedGenres');
            if (!user || !user.selectedGenres || user.selectedGenres.length === 0) {
                throw new Error('No genres selected for this user.');
            }
    
            const genres = user.selectedGenres;
    
            // Fetch the IDs and other details of the categories based on their names
            const categories = await CategoryModel.find({ name: { $in: genres } })
                .select('_id name image'); // Include category name and image
            if (!categories || categories.length === 0) {
                throw new Error('No matching categories found for the selected genres.');
            }
    
            const categoryIds = categories.map((category) => category._id);
    
            // Divide the 10-store limit equally across the selected categories
            const storesPerCategory = Math.ceil(10 / categoryIds.length);
    
            let recommendedStores = [];
    
            for (const category of categories) {
                const stores = await StoreModel.find({ category: category._id }) // Find stores by category ID
                    .select('_id storeName logo category') // Include category in the store data
                    .limit(storesPerCategory); // Limit results per category
    
                // Add category details and filter for in-stock products for each store
                const enrichedStores = await Promise.all(stores.map(async (store) => {
                    const inStockProducts = await ProductModel.find({
                        store: store._id,
                        inStock: true, // Only include in-stock products
                    }).select('_id name price image'); // Include relevant product fields
                    
                    return {
                        ...store.toObject(),
                        category: {
                            _id: category._id,
                            name: category.name,
                            image: category.image,
                        },
                        products: inStockProducts, // Attach in-stock products to the store
                    };
                }));
    
                recommendedStores.push(...enrichedStores);
            }
    
            // Shuffle the recommendedStores array
            recommendedStores = recommendedStores.sort(() => Math.random() - 0.5);
    
            // Ensure no more than 10 stores are returned overall
            recommendedStores = recommendedStores.slice(0, 10);
    
            return recommendedStores; // Return the list of enriched stores
        } catch (error) {
            console.error('Error fetching stores by genres:', error);
            throw new Error('Failed to fetch stores by genres.');
        }
    }
    
    
    
}

module.exports = UserServices;
