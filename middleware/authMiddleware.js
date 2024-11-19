const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    try {
        console.log('Authenticating token in middleware...');
        
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        console.log('Authorization header:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Token not provided or malformed');
            return res.status(401).json({ status: false, message: 'Token must be provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Extracted token:', token);

        // Verify the token
        const decoded = jwt.verify(token, "secret");
        console.log('Decoded token:', decoded);

        req.user = decoded; // Attach decoded payload to `req.user`
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);

        // Inspect the error object for more details
        console.log('Error details:', error);

        return res.status(401).json({ status: false, message: 'Invalid or expired token' });
    }
};
module.exports = authenticateToken;

