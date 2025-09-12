    // backend/middleware/auth.js
    const jwt = require('jsonwebtoken');
    require('dotenv').config(); // Make sure to load environment variables

    module.exports = function (req, res, next) {
      // Get token from header
      // The token is usually sent in the 'x-auth-token' header
      const token = req.header('x-auth-token');

      // Check if no token
      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      // Verify token
      try {
        // jwt.verify takes the token and the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user payload to the request object
        // This makes user information available in subsequent route handlers
        req.user = decoded.user;
        next(); // Call next middleware or route handler
      } catch (err) {
        // If token is not valid (e.g., expired, malformed)
        res.status(401).json({ msg: 'Token is not valid' });
      }
    };
    