const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    console.log("arrived token", token);

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded form middleware",decoded);
    req.userId = decoded.userId;
    next();

  }
  catch (err) {
    res.status(402).send({
      success: false,
      message: 'invalid or expired token'
    });
  }
}

module.exports = authMiddleware;