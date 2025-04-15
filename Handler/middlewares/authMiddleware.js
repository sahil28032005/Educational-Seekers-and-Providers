const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    // Debug: Log the token
    console.log('Token received:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided, authorization denied' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'asjiye7638');
    
    // Debug: Log the decoded token
    console.log('Decoded token:', decoded);
    
    // Set userId from the decoded token
    // The token contains 'id' not 'userId'
    req.userId = decoded.id;
    
    // Debug: Log the extracted userId
    console.log('Authenticated user ID:', req.userId);
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Token is not valid',
      error: error.message 
    });
  }
};

module.exports = authMiddleware;