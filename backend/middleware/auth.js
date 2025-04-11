const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/envConfig');

const isAdmin = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No token provided.' 
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if user is admin using token data
        if (!decoded.admin) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Admin privileges required.' 
            });
        }

        // Add user data from token to request object
        req.user = {
            id: decoded.id,
            name: decoded.name,
            admin: decoded.admin
        };
        
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token.' 
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired.' 
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error.' 
        });
    }
};

module.exports = { isAdmin }; 