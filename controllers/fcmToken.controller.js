const FCMToken = require('../model/fcmToken.model');

// Save or update FCM token
exports.saveToken = async (req, res) => {
    try {
        const { fcmToken, userType } = req.body;

        console.log(`fcmToken: ${fcmToken},  userType= ${userType}`);


        if (!fcmToken) {
            return res.status(400).json({ message: 'fcmToken is required' });
        }

        // Determine userType from the authenticated request
        const userId = userType === 'user' ? req.user._id : null;
        const storeId = userType === 'store' ? req.user._id : null;

        if (!userId && !storeId) {
            return res.status(400).json({ message: 'Invalid user type or missing user/store ID' });
        }

        // Find existing token and upsert
        const filter = userId ? { userId, fcmToken } : { storeId, fcmToken };
        const update = { $set: { lastUpdated: Date.now() } };

        const token = await FCMToken.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
        });

        res.status(200).json({ message: 'Token saved/updated successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save token', error: error.message });
    }
};


exports.deleteToken = async (req, res) => {
    try {
        const { fcmToken } = req.body;

        if (!fcmToken) {
            return res.status(400).json({ message: 'fcmToken is required' });
        }

        // Determine userType from the authenticated request
        const userType = req.user.userType; // e.g., 'user' or 'store'
        const userId = userType === 'user' ? req.user._id : null;
        const storeId = userType === 'store' ? req.user._id : null;

        if (!userId && !storeId) {
            return res.status(400).json({ message: 'Invalid user type or missing user/store ID' });
        }

        // Find the token and delete it
        const filter = userId ? { userId, fcmToken } : { storeId, fcmToken };
        await FCMToken.deleteOne(filter);

        res.status(200).json({ message: 'Token deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete token', error: error.message });
    }
};

// Get FCM tokens for a user or store
exports.getToken = async (req, res) => {
    try {
        console.log('getToken endpoint hit with query:', req.query); // Log incoming query

        const { userId, storeId } = req.query;

        if (!userId && !storeId) {
            return res.status(400).json({ message: 'Either userId or storeId is required' });
        }

        const filter = userId ? { userId } : { storeId };
        const tokens = await FCMToken.find(filter);
        console.log(`returning fmc token: ${tokens}`);

        res.status(200).json({ tokens });
    } catch (error) {
        console.error(`Failed to retrieve tokens : ${error}`);
        res.status(500).json({ message: 'Failed to retrieve tokens', error: error.message });
    }
};

exports.getAllTokens = async (req, res) => {
    try {
        // Retrieve all FCM tokens from the database
        const tokens = await FCMToken.find({}, 'fcmToken userId storeId').lean();

        if (!tokens.length) {
            return res.status(404).json({ message: 'No FCM tokens found' });
        }

        res.status(200).json({
            message: 'All tokens retrieved successfully',
            tokens,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to retrieve tokens',
            error: error.message,
        });
    }
};
