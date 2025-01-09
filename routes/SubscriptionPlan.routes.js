const express = require("express");
const router = express.Router();
const subscriptionPlanController = require("../controllers/SubscriptionPlan.controller");
const authMiddleware = require('../middleware/authMiddleware');

// Route to add a new subscription plan
router.post("/add", authMiddleware, subscriptionPlanController.addSubscriptionPlan);
router.get("/getPlans", authMiddleware, subscriptionPlanController.getAllSubscriptionPlans);

module.exports = router;
