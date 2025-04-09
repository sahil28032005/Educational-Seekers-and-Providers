const prisma = require('../config/prismaClient');
const { kafka, producer, initProducer } = require('../config/kafkaClient');

// Initialize Kafka producer
exports.initializeKafka = async () => {
    await initProducer();
    console.log('Kafka producer initialized for connection service');
};

/**
 * Create a new connection request
 */
exports.createConnection = async (req, res) => {
    try {
        // Initialize Kafka producer if not already
        if (!producer.isConnected()) {
            await initProducer();
        }

        const { requesterId, receiverId } = req.body;

        // Validate input
        if (!requesterId || !receiverId) {
            return res.status(400).json({
                success: false,
                message: 'Both requesterId and receiverId are required'
            });
        }

        // Check if users exist
        const requester = await prisma.user.findUnique({
            where: { id: parseInt(requesterId) }
        });

        const receiver = await prisma.user.findUnique({
            where: { id: parseInt(receiverId) }
        });

        if (!requester || !receiver) {
            return res.status(404).json({
                success: false,
                message: 'One or both users not found'
            });
        }

        // Check if a connection already exists
        const existingConnection = await prisma.connection.findFirst({
            where: {
                OR: [
                    {
                        requesterId: parseInt(requesterId),
                        receiverId: parseInt(receiverId)
                    },
                    {
                        requesterId: parseInt(receiverId),
                        receiverId: parseInt(requesterId)
                    }
                ]
            }
        });

        if (existingConnection) {
            return res.status(200).json({
                success: true,
                message: 'Connection already exists',
                data: existingConnection
            });
        }

        // Create new connection
        const connection = await prisma.connection.create({
            data: {
                requesterId: parseInt(requesterId),
                receiverId: parseInt(receiverId),
                status: 'pending'
            }
        });

        // Send notification via Kafka
        await sendNotification('connection-status', {
            type: 'connectionRequest',
            requesterId: parseInt(requesterId),
            receiverId: parseInt(receiverId),
            connectionId: connection.id,
            content: `${requester.name} sent you a connection request`,
            timestamp: new Date().toISOString()
        });

        // Create notification in database
        await prisma.notification.create({
            data: {
                userId: parseInt(receiverId),
                type: 'connectionRequest',
                content: `${requester.name} sent you a connection request`,
                metadata: {
                    connectionId: connection.id,
                    requesterName: requester.name,
                    requesterImg: requester.profileImg
                }
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Connection request sent successfully',
            data: connection
        });
    } catch (error) {
        console.error('Error creating connection:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create connection',
            error: error.message
        });
    }
};

/**
 * Update connection status (accept/reject)
 */
exports.updateConnectionStatus = async (req, res) => {
    try {
        const { connectionId, status } = req.body;
        
        if (!connectionId || !status) {
            return res.status(400).json({
                success: false,
                message: 'ConnectionId and status are required'
            });
        }
        
        // Validate status
        const validStatuses = ['accepted', 'rejected', 'blocked'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        // Find the connection
        const connection = await prisma.connection.findUnique({
            where: { id: parseInt(connectionId) },
            include: {
                requester: true,
                receiver: true
            }
        });

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: 'Connection not found'
            });
        }

        // Update connection status
        const updatedConnection = await prisma.connection.update({
            where: { id: parseInt(connectionId) },
            data: { status },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true,
                        role: true,
                        location: true,
                        expertise: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true,
                        role: true,
                        location: true,
                        expertise: true
                    }
                }
            }
        });

        // Send notification to requester
        await sendNotification('connection-status', {
            type: 'connectionStatusUpdate',
            connectionId: connection.id,
            status,
            requesterId: connection.requesterId,
            receiverId: connection.receiverId,
            content: `Your connection request to ${connection.receiver.name} was ${status}`,
            timestamp: new Date().toISOString()
        });

        // Create notification in database for requester
        await prisma.notification.create({
            data: {
                userId: connection.requesterId,
                type: 'connectionStatusUpdate',
                content: `Your connection request to ${connection.receiver.name} was ${status}`,
                metadata: {
                    connectionId: connection.id,
                    status,
                    userName: connection.receiver.name,
                    userImg: connection.receiver.profileImg
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: `Connection ${status} successfully`,
            data: updatedConnection
        });
    } catch (error) {
        console.error('Error updating connection status:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update connection status',
            error: error.message
        });
    }
};

/**
 * Get pending connection requests for a user
 */
exports.getPendingConnections = async (req, res) => {
    try {
        const userId = parseInt(req.query.userId || req.userId);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const pendingConnections = await prisma.connection.findMany({
            where: {
                receiverId: userId,
                status: 'pending'
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true,
                        role: true,
                        location: true,
                        expertise: true,
                        bio: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Pending connections retrieved successfully',
            data: pendingConnections
        });
    } catch (error) {
        console.error('Error fetching pending connections:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch pending connections',
            error: error.message
        });
    }
};

/**
 * Get all connections for a user (accepted)
 */
exports.getUserConnections = async (req, res) => {
    try {
        const userId = parseInt(req.query.userId || req.userId);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Get connections where user is either requester or receiver and status is accepted
        const connections = await prisma.connection.findMany({
            where: {
                OR: [
                    { requesterId: userId },
                    { receiverId: userId }
                ],
                status: 'accepted'
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true,
                        role: true,
                        location: true,
                        expertise: true,
                        bio: true,
                        status: true,
                        lastActive: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true,
                        role: true,
                        location: true,
                        expertise: true,
                        bio: true,
                        status: true,
                        lastActive: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Format the response to show the connected user (not the current user)
        const formattedConnections = connections.map(connection => {
            const isRequester = connection.requesterId === userId;
            const connectedUser = isRequester ? connection.receiver : connection.requester;
            
            return {
                connectionId: connection.id,
                status: connection.status,
                createdAt: connection.createdAt,
                updatedAt: connection.updatedAt,
                user: connectedUser
            };
        });

        return res.status(200).json({
            success: true,
            message: 'User connections retrieved successfully',
            data: formattedConnections
        });
    } catch (error) {
        console.error('Error fetching user connections:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user connections',
            error: error.message
        });
    }
};

/**
 * Get connection suggestions for a user
 */
exports.getConnectionSuggestions = async (req, res) => {
    try {
        const userId = parseInt(req.query.userId || req.userId);
        const limit = parseInt(req.query.limit || 10);
        const page = parseInt(req.query.page || 1);
        const skip = (page - 1) * limit;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Get current user's data
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                location: true,
                expertise: true,
                role: true
            }
        });

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get IDs of users already connected or with pending requests
        const existingConnections = await prisma.connection.findMany({
            where: {
                OR: [
                    { requesterId: userId },
                    { receiverId: userId }
                ]
            },
            select: {
                requesterId: true,
                receiverId: true
            }
        });

        const connectedUserIds = new Set();
        connectedUserIds.add(userId); // Add current user to exclude

        existingConnections.forEach(conn => {
            connectedUserIds.add(conn.requesterId);
            connectedUserIds.add(conn.receiverId);
        });

        // Find users with similar interests or location
        const suggestions = await prisma.user.findMany({
            where: {
                id: { notIn: Array.from(connectedUserIds) },
                OR: [
                    { location: currentUser.location },
                    { role: currentUser.role },
                    { expertise: { hasSome: currentUser.expertise } }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                profileImg: true,
                role: true,
                location: true,
                expertise: true,
                bio: true
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Count total suggestions for pagination
        const totalCount = await prisma.user.count({
            where: {
                id: { notIn: Array.from(connectedUserIds) },
                OR: [
                    { location: currentUser.location },
                    { role: currentUser.role },
                    { expertise: { hasSome: currentUser.expertise } }
                ]
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Connection suggestions retrieved successfully',
            data: suggestions,
            pagination: {
                total: totalCount,
                page,
                limit,
                pages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching connection suggestions:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch connection suggestions',
            error: error.message
        });
    }
};

/**
 * Remove a connection
 */
exports.removeConnection = async (req, res) => {
    try {
        const { connectionId } = req.params;
        const userId = parseInt(req.userId);

        if (!connectionId) {
            return res.status(400).json({
                success: false,
                message: 'Connection ID is required'
            });
        }

        // Find the connection
        const connection = await prisma.connection.findUnique({
            where: { id: parseInt(connectionId) },
            include: {
                requester: true,
                receiver: true
            }
        });

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: 'Connection not found'
            });
        }

        // Verify the user is part of this connection
        if (connection.requesterId !== userId && connection.receiverId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to remove this connection'
            });
        }

        // Delete the connection
        await prisma.connection.delete({
            where: { id: parseInt(connectionId) }
        });

        // Determine the other user in the connection
        const otherUserId = connection.requesterId === userId 
            ? connection.receiverId 
            : connection.requesterId;
        
        const otherUser = connection.requesterId === userId 
            ? connection.receiver 
            : connection.requester;

        // Send notification to the other user
        await sendNotification('connection-status', {
            type: 'connectionRemoved',
            connectionId: parseInt(connectionId),
            userId: otherUserId,
            content: `${connection.requester.name} has removed the connection with you`,
            timestamp: new Date().toISOString()
        });

        // Create notification in database
        await prisma.notification.create({
            data: {
                userId: otherUserId,
                type: 'connectionRemoved',
                content: `${connection.requester.name} has removed the connection with you`,
                metadata: {
                    connectionId: parseInt(connectionId),
                    userName: connection.requester.name
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Connection removed successfully'
        });
    } catch (error) {
        console.error('Error removing connection:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to remove connection',
            error: error.message
        });
    }
};

/**
 * Helper function to send notification via Kafka
 */
const sendNotification = async (topic, message) => {
    try {
        if (!producer.isConnected()) {
            await initProducer();
        }
        
        await producer.send({
            topic,
            messages: [{
                value: JSON.stringify(message),
            }]
        });

        console.log(`Sent notification to ${topic}:`, message);
        return true;
    } catch (error) {
        console.error('Failed to send notification:', error.message);
        return false;
    }
};