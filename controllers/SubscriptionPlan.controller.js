const SubscriptionPlan = require("../model/SubscriptionPlan.model.js");

// Add a new subscription plan
exports.addSubscriptionPlan = async (req, res) => {
    try {
        const { name, description, price, features, duration } = req.body;

        // Validate required fields
        if (!name || !description || !price || !features || !duration) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Ensure duration is a positive number
        if (typeof duration !== "number" || duration <= 0) {
            return res
                .status(400)
                .json({ message: "Duration must be a positive number" });
        }

        // Create the subscription plan
        const newPlan = new SubscriptionPlan({
            name,
            description,
            price,
            features,
            duration,
        });

        const savedPlan = await newPlan.save();
        return res
            .status(201)
            .json({ message: "Plan added successfully", savedPlan });
    } catch (error) {
        console.error("Error adding subscription plan:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

// Get all subscription plans
exports.getAllSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find(); // Retrieve all plans from the database
        return res.status(200).json(plans); // Respond with the list of plans
    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};
