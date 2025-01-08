//user.route.js
//we will handle user registration & login event 
//through which user will be able to create his account into mongodb 
//database using /register api and then get signIn using /login api
const router = require("express").Router();
const UserController = require('../controllers/user.controller');
const authenticateToken = require('../middleware/authMiddleware');


router.post('/registration', UserController.register);
router.post("/login", UserController.login);
router.post("/validateToken", UserController.validateToken);
router.get('/check-email', UserController.checkEmailAvailability);
router.get('/getID', authenticateToken, UserController.getUserId);

router.post("/forgotPassword", UserController.forgotPassword);
router.post("/resetPassword", authenticateToken, UserController.resetPassword);
router.get("/getPersonalInfo", authenticateToken, UserController.getPersonalInfo);
router.post("/updateUserPersonalInfo", authenticateToken, UserController.updateUserPersonalInfo);
router.post("/addCreditCard", authenticateToken, UserController.addCreditCard);
router.get("/getCreditCardData", authenticateToken, UserController.getCreditCardData);

router.get("/getRecommendedStoresByCategory", authenticateToken, UserController.storesOfFavCategories);

// handle favoriteStores
//router.put('/favoriteStores/:storeId', authenticateToken, UserController.addFavoriteStore);
//router.delete('/favoriteStores/:storeId', authenticateToken, UserController.removeFavoriteStore);

// handle wishlist
router.post('/wishlist/:productId', authenticateToken, UserController.addToWishlist);
router.delete('/wishlist/:productId', authenticateToken, UserController.removeFromWishlist);
router.get("/wishlist/checkIfExist/:productId", authenticateToken, UserController.checkIfInWishlist);
router.get("/wishlist/getList", authenticateToken, UserController.getWishList);

router.get("/getFullName", UserController.getFullName);
module.exports = router;
