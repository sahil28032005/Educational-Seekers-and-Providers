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

        //check weather the connection request already exists
        const existingConnection = await prisma.connection.findFirst({
            where: {
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

        // Create connection request in database if not already present 
        let connectionRequest;
        if (existingConnection) {
            connectionRequest = existingConnection;

            // Only create notification in database for new requests
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
        }
        else {
            connectionRequest = await prisma.connection.create({
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
        }




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

// accept a connection request

exports.acceptConnection = async (req, res) => {
    try {
        const { connectionId } = req.body;
        const userId = parseInt(req.userId); //try to get this from auth middleware

        // Find the connection request
        const connectionRequest = await prisma.connection.findUnique({
            where: { id: parseInt(connectionId) },
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

        //check if user wxists and iser is the receiveer
        if (!connectionRequest) {
            return res.status(404).json({
                success: false,
                message: 'Connection request not found'
            });
        }

        //update connection status to accepted
        const updatedConnection = await prisma.connection.update({
            where: { id: parseInt(connectionId) },
            data: { status: 'accepted' },
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

        // Create notification for the requester
        await prisma.notification.create({
            data: {
                userId: connectionRequest.requesterId,
                type: 'connectionAccepted',
                content: `${connectionRequest.receiver.name} accepted your connection request`,
                metadata: {
                    connectionId: connectionRequest.id,
                    receiverId: userId
                }
            }
        });

        // Publish event to Kafka
        await publishEvent({
            id: updatedConnection.id,
            requesterId: updatedConnection.requesterId,
            receiverId: updatedConnection.receiverId,
            status: updatedConnection.status,
            createdAt: updatedConnection.createdAt,
            type: 'connection_accepted',
            receiverDetails: {
                name: updatedConnection.receiver.name,
                profileImg: updatedConnection.receiver.profileImg
            },
            notification: {
                title: 'Connection Accepted',
                message: `${updatedConnection.receiver.name} accepted your connection request`,
                type: 'connection_accepted'
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Connection request accepted successfully',
            data: updatedConnection
        });
    }
    catch (error) {
        console.error('Error accepting connection:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to accept connection request',
            error: error.message
        });
    }
}

// get accepted connetions for user
exports.getAcceptedConnections = async (req, res) => {
  try {
    // Fix the userId parsing issue
    if (!req.userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User ID not found. Authentication required.' 
      });
    }
    
    // Parse userId safely with base 10
    const userId = parseInt(req.userId, 10);
    
    // Validate that userId is a valid number
    if (isNaN(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format.' 
      });
    }

    console.log('Fetching connections for user ID:', userId);

    // Get connections where user is either requester or receiver and status is accepted
    const acceptedConnections = await prisma.connection.findMany({
      where: {
        OR: [
          {
            requesterId: userId
          },
          {
            receiverId: userId
          }
        ],
        status: "accepted"
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
        },
        receiver: {
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
        updatedAt: "desc"
      }
    });

    // Transform the data to show the connected user (not the current user)
    const formattedConnections = acceptedConnections.map(connection => {
      const isRequester = connection.requesterId === userId;
      const connectedUser = isRequester ? connection.receiver : connection.requester;
      
      return {
        connectionId: connection.id,
        user: connectedUser,
        status: 'accepted',
        createdAt: connection.createdAt,
        updatedAt: connection.updatedAt
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Accepted connections retrieved successfully',
      data: formattedConnections
    });
  } catch (error) {
    console.error('Error fetching accepted connections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch accepted connections',
      error: error.message
    });
  }
};

// Add a new function to get all connections
exports.getAllConnections = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User ID not found. Authentication required.' 
      });
    }
    
    const userId = parseInt(req.userId, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format.' 
      });
    }

    // Get all connections for the user (pending, accepted, rejected)
    const allConnections = await prisma.connection.findMany({
      where: {
        OR: [
          {
            requesterId: userId
          },
          {
            receiverId: userId
          }
        ]
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
        },
        receiver: {
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
        updatedAt: "desc"
      }
    });

    res.status(200).json({
      success: true,
      connections: allConnections
    });
  } catch (error) {
    console.error('Error fetching all connections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all connections',
      error: error.message
    });
  }
};