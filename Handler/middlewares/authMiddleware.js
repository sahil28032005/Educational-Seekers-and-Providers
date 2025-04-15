const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add user info to request
    req.user = decoded;
    
    // For debugging
    console.log("Authenticated user:", req.user);
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;