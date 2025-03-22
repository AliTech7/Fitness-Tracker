const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || "your_jwt_secret_key";

module.exports = {
    authenticate: (req, res, next) => {
        try {
            // Get token from Authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: "Authentication required" });
            }

            // Extract the token from the Authorization header
            const token = authHeader.split(' ')[1];
            
            // Verify the token
            jwt.verify(token, secretKey, (err, payload) => {
                if (err) {
                    return res.status(401).json({ message: "Invalid or expired token" });
                }
                
                // Add user data to request object
                req.user = payload;
                next();
            });
        } catch (err) {
            console.error("JWT Authentication Error:", err);
            return res.status(401).json({ message: "Authentication failed" });
        }
    },

    // Function to generate JWT token
    generateToken: (userData) => {
        return jwt.sign(
            {
                _id: userData._id,
                email: userData.email
            },
            secretKey,
            { expiresIn: '24h' }  // Token expires in 24 hours
        );
    }
}; 
