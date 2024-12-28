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

router.get("/getFullName", UserController.getFullName);
module.exports = router;
