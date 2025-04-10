const prisma = require('../config/prismaClient');
const { publishEvent } = require('../config/kafkaClient');

exports.createConnection = async (req, res) => {
    try {
        const { requesterId, receiverId } = req.body;

        // Validate input
        if (!requesterId || !receiverId) {
            return res.status(400).json({
                success: false,
                message: 'Both requesterId and receiverId are required'
            });
        }

        // Create connection request in database
        const connectionRequest = await prisma.connection.create({
            data: {
                requesterId: parseInt(requesterId),
                receiverId: parseInt(receiverId),
                status: 'pending'
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true
                    }
                }
            }
        });

        // Update the Kafka event payload with more detailed information
        await publishEvent({
            id: connectionRequest.id,
            requesterId: connectionRequest.requesterId,
            receiverId: connectionRequest.receiverId,
            status: connectionRequest.status,
            createdAt: connectionRequest.createdAt,
            type: 'connection_request',
            requesterDetails: {
                name: connectionRequest.requester.name,
                profileImg: connectionRequest.requester.profileImg
            },
            notification: {
                title: 'New Connection Request',
                message: `${connectionRequest.requester.name} sent you a connection request`,
                type: 'connection_request'
            }
        });

        // Create notification in database
        await prisma.notification.create({
            data: {
                userId: parseInt(receiverId),
                type: 'connectionRequest',
                content: `You have a new connection request`,
                metadata: {
                    connectionId: connectionRequest.id,
                    requesterId: parseInt(requesterId)
                }
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Connection request sent successfully',
            data: connectionRequest
        });
    } catch (error) {
        console.error('Error creating connection:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create connection request',
            error: error.message
        });
    }
};


// Add this function to your connectionController.js file

/**
 * Get pending connection requests for a user
 */
exports.getPendingConnections = async (req, res) => {
    try {
        const userId = parseInt(req.userId); // This comes from the authMiddleware

        // Get pending connection requests where the user is the receiver
        const pendingRequests = await prisma.connection.findMany({
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
                        location: true,
                        expertise: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Pending connection requests retrieved successfully',
            data: pendingRequests
        });
    } catch (error) {
        console.error('Error fetching pending connections:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch pending connection requests',
            error: error.message
        });
    }
};
