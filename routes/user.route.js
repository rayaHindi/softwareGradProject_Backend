//user.route.js
//we will handle user registration & login event 
//through which user will be able to create his account into mongodb 
//database using /register api and then get signIn using /login api
const router = require("express").Router();
const UserController = require('../controllers/user.controller');


router.post("/register",UserController.register);
router.post("/login", UserController.login);
router.post("/forgotPassword", UserController.forgotPassword);
router.post("/resetPassword", UserController.resetPassword);
router.get("/getPersonalInfo", UserController.getPersonalInfo); 
router.post("/updateUserPersonalInfo", UserController.updateUserPersonalInfo);
module.exports = router;
