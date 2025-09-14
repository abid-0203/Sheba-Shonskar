    // backend/middleware/auth.js
    const jwt = require('jsonwebtoken');
    require('dotenv').config(); // Make sure to load environment variables

    module.exports = function (req, res, next) {
      
      const token = req.header('x-auth-token');

      // Check if no token
      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      // Verify token
      try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        
        req.user = decoded.user;
        next(); 
      } catch (err) {
        // If token is not valid (e.g., expired, malformed)
        res.status(401).json({ msg: 'Token is not valid' });
      }
    };
    