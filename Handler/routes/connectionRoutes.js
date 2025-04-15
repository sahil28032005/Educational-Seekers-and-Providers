const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a new connection request
router.post('/create', authMiddleware, connectionController.createConnection);

// Get pending connection requests
router.get('/pending', authMiddleware, connectionController.getPendingConnections);

// Accept a connection request
router.post('/accept', authMiddleware, connectionController.acceptConnection);

// Get accepted connections
router.get('/accepted', authMiddleware, connectionController.getAcceptedConnections);

// Add the missing route for all connections
router.get('/all', authMiddleware, connectionController.getAllConnections);

module.exports = router;