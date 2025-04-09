const prisma = require('../config/prismaClient');
const { kafka, producer, initProducer } = require('../config/kafkaClient');

/**
 * Create a new group
 */
exports.createGroup = async (req, res) => {
    try {
        const { name, description, category, isPublic = true } = req.body;
        const creatorId = parseInt(req.userId);

        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: 'Group name and category are required'
            });
        }

        // Create the group
        const group = await prisma.group.create({
            data: {
                name,
                description,
                category,
                isPublic,
                creatorId,
                members: {
                    create: {
                        userId: creatorId,
                        role: 'admin'
                    }
                }
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImg: true
                            }
                        }
                    }
                }
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Group created successfully',
            data: group
        });
    } catch (error) {
        console.error('Error creating group:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create group',
            error: error.message
        });
    }
};

/**
 * Get all groups with pagination and filtering
 */
exports.getAllGroups = async (req, res) => {
    try {
        const { category, search, limit = 10, page = 1 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build filter conditions
        const where = {};
        
        if (category) {
            where.category = category;
        }
        
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Get groups with member count
        const groups = await prisma.group.findMany({
            where,
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        profileImg: true
                    }
                },
                _count: {
                    select: { members: true }
                }
            },
            skip,
            take: parseInt(limit),
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Get total count for pagination
        const totalCount = await prisma.group.count({ where });

        return res.status(200).json({
            success: true,
            message: 'Groups retrieved successfully',
            data: groups,
            pagination: {
                total: totalCount,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(totalCount / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching groups:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch groups',
            error: error.message
        });
    }
};

/**
 * Get a single group by ID
 */
exports.getGroupById = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImg: true,
                                role: true,
                                location: true
                            }
                        }
                    }
                },
                _count: {
                    select: { members: true }
                }
            }
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Group retrieved successfully',
            data: group
        });
    } catch (error) {
        console.error('Error fetching group:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch group',
            error: error.message
        });
    }
};

/**
 * Join a group
 */
exports.joinGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = parseInt(req.userId);

        // Check if group exists
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
            include: {
                creator: true
            }
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is already a member
        const existingMembership = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId: parseInt(groupId)
                }
            }
        });

        if (existingMembership) {
            return res.status(400).json({
                success: false,
                message: 'You are already a member of this group'
            });
        }

        // Add user to group
        const membership = await prisma.groupMember.create({
            data: {
                userId,
                groupId: parseInt(groupId),
                role: 'member'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true
                    }
                },
                group: true
            }
        });

        // Notify group creator
        await sendNotification('group-activity', {
            type: 'newMember',
            groupId: parseInt(groupId),
            userId,
            creatorId: group.creatorId,
            content: `A new user has joined your group: ${group.name}`,
            timestamp: new Date().toISOString()
        });

        // Create notification in database
        await prisma.notification.create({
            data: {
                userId: group.creatorId,
                type: 'newGroupMember',
                content: `A new user has joined your group: ${group.name}`,
                metadata: {
                    groupId: parseInt(groupId),
                    groupName: group.name,
                    userId
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Successfully joined the group',
            data: membership
        });
    } catch (error) {
        console.error('Error joining group:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to join group',
            error: error.message
        });
    }
};

/**
 * Leave a group
 */
exports.leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = parseInt(req.userId);

        // Check if user is a member
        const membership = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId: parseInt(groupId)
                }
            },
            include: {
                group: true
            }
        });

        if (!membership) {
            return res.status(404).json({
                success: false,
                message: 'You are not a member of this group'
            });
        }

        // Check if user is the creator/admin
        if (membership.role === 'admin' && membership.group.creatorId === userId) {
            // Count other admins
            const otherAdmins = await prisma.groupMember.count({
                where: {
                    groupId: parseInt(groupId),
                    role: 'admin',
                    userId: { not: userId }
                }
            });

            if (otherAdmins === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'As the only admin, you cannot leave the group. Transfer admin role or delete the group.'
                });
            }
        }

        // Remove user from group
        await prisma.groupMember.delete({
            where: {
                userId_groupId: {
                    userId,
                    groupId: parseInt(groupId)
                }
            }
        });

        // Notify group creator if different from the leaving user
        if (membership.group.creatorId !== userId) {
            await sendNotification('group-activity', {
                type: 'memberLeft',
                groupId: parseInt(groupId),
                userId,
                creatorId: membership.group.creatorId,
                content: `A member has left your group: ${membership.group.name}`,
                timestamp: new Date().toISOString()
            });

            // Create notification in database
            await prisma.notification.create({
                data: {
                    userId: membership.group.creatorId,
                    type: 'groupMemberLeft',
                    content: `A member has left your group: ${membership.group.name}`,
                    metadata: {
                        groupId: parseInt(groupId),
                        groupName: membership.group.name,
                        userId
                    }
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully left the group'
        });
    } catch (error) {
        console.error('Error leaving group:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to leave group',
            error: error.message
        });
    }
};

/**
 * Get groups a user is a member of
 */
exports.getUserGroups = async (req, res) => {
    try {
        const userId = parseInt(req.query.userId || req.userId);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const userGroups = await prisma.groupMember.findMany({
            where: { userId },
            include: {
                group: {
                    include: {
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                profileImg: true
                            }
                        },
                        _count: {
                            select: { members: true }
                        }
                    }
                }
            }
        });

        // Format the response
        const formattedGroups = userGroups.map(membership => ({
            ...membership.group,
            userRole: membership.role,
            joinedAt: membership.joinedAt
        }));

        return res.status(200).json({
            success: true,
            message: 'User groups retrieved successfully',
            data: formattedGroups
        });
    } catch (error) {
        console.error('Error fetching user groups:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user groups',
            error: error.message
        });
    }
};

/**
 * Update group information
 */
exports.updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, description, category, isPublic, imageUrl } = req.body;
        const userId = parseInt(req.userId);

        // Check if group exists
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
            include: {
                members: {
                    where: {
                        userId,
                        role: { in: ['admin', 'moderator'] }
                    }
                }
            }
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user has permission to update
        if (group.creatorId !== userId && group.members.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this group'
            });
        }

        // Update group
        const updatedGroup = await prisma.group.update({
            where: { id: parseInt(groupId) },
            data: {
                name: name || group.name,
                description: description !== undefined ? description : group.description,
                category: category || group.category,
                isPublic: isPublic !== undefined ? isPublic : group.isPublic,
                imageUrl: imageUrl || group.imageUrl
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        profileImg: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImg: true
                            }
                        }
                    }
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Group updated successfully',
            data: updatedGroup
        });
    } catch (error) {
        console.error('Error updating group:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update group',
            error: error.message
        });
    }
};

/**
 * Delete a group
 */
exports.deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = parseInt(req.userId);

        // Check if group exists
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) }
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is the creator
        if (group.creatorId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Only the group creator can delete the group'
            });
        }

        // Get all members for notification
        const members = await prisma.groupMember.findMany({
            where: {
                groupId: parseInt(groupId),
                userId: { not: userId }
            },
            select: {
                userId: true
            }
        });

        // Delete group (this will cascade delete all memberships due to relations)
        await prisma.group.delete({
            where: { id: parseInt(groupId) }
        });

        // Notify all members
        for (const member of members) {
            await prisma.notification.create({
                data: {
                    userId: member.userId,
                    type: 'groupDeleted',
                    content: `The group "${group.name}" has been deleted by the creator`,
                    metadata: {
                        groupId: parseInt(groupId),
                        groupName: group.name
                    }
                }
            });

            await sendNotification('group-activity', {
                type: 'groupDeleted',
                groupId: parseInt(groupId),
                userId: member.userId,
                content: `The group "${group.name}" has been deleted by the creator`,
                timestamp: new Date().toISOString()
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Group deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting group:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete group',
            error: error.message
        });
    }
};

/**
 * Change member role in a group
 */
exports.changeMemberRole = async (req, res) => {
    try {
        const { groupId, memberId } = req.params;
        const { role } = req.body;
        const userId = parseInt(req.userId);

        if (!role || !['admin', 'moderator', 'member'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Valid role is required (admin, moderator, or member)'
            });
        }

        // Check if group exists
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) }
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user has permission (must be creator or admin)
        const userMembership = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId: parseInt(groupId)
                }
            }
        });

        if (!userMembership || (userMembership.role !== 'admin' && group.creatorId !== userId)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to change member roles'
            });
        }

        // Check if target member exists
        const targetMembership = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: parseInt(memberId),
                    groupId: parseInt(groupId)
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true
                    }
                }
            }
        });

        if (!targetMembership) {
            return res.status(404).json({
                success: false,
                message: 'Member not found in this group'
            });
        }

        // Prevent changing role of the group creator
        if (parseInt(memberId) === group.creatorId && role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Cannot change the role of the group creator'
            });
        }

        // Update member role
        const updatedMembership = await prisma.groupMember.update({
            where: {
                userId_groupId: {
                    userId: parseInt(memberId),
                    groupId: parseInt(groupId)
                }
            },
            data: { role },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true
                    }
                }
            }
        });

        // Notify the member about role change
        await prisma.notification.create({
            data: {
                userId: parseInt(memberId),
                type: 'roleChanged',
                content: `Your role in the group "${group.name}" has been changed to ${role}`,
                metadata: {
                    groupId: parseInt(groupId),
                    groupName: group.name,
                    role
                }
            }
        });

        await sendNotification('group-activity', {
            type: 'roleChanged',
            groupId: parseInt(groupId),
            userId: parseInt(memberId),
            content: `Your role in the group "${group.name}" has been changed to ${role}`,
            timestamp: new Date().toISOString()
        });

        return res.status(200).json({
            success: true,
            message: 'Member role updated successfully',
            data: updatedMembership
        });
    } catch (error) {
        console.error('Error changing member role:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to change member role',
            error: error.message
        });
    }
};

/**
 * Remove a member from a group
 */
exports.removeMember = async (req, res) => {
    try {
        const { groupId, memberId } = req.params;
        const userId = parseInt(req.userId);

        // Check if group exists
        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) }
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user has permission (must be creator or admin)
        const userMembership = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId: parseInt(groupId)
                }
            }
        });

        if (!userMembership || (userMembership.role !== 'admin' && group.creatorId !== userId)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to remove members'
            });
        }

        // Check if target member exists
        const targetMembership = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: parseInt(memberId),
                    groupId: parseInt(groupId)
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!targetMembership) {
            return res.status(404).json({
                success: false,
                message: 'Member not found in this group'
            });
        }

        // Prevent removing the group creator
        if (parseInt(memberId) === group.creatorId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot remove the group creator'
            });
        }

        // Remove the member
        await prisma.groupMember.delete({
            where: {
                userId_groupId: {
                    userId: parseInt(memberId),
                    groupId: parseInt(groupId)
                }
            }
        });

        // Notify the removed member
        await prisma.notification.create({
            data: {
                userId: parseInt(memberId),
                type: 'removedFromGroup',
                content: `You have been removed from the group "${group.name}"`,
                metadata: {
                    groupId: parseInt(groupId),
                    groupName: group.name
                }
            }
        });

        await sendNotification('group-activity', {
            type: 'removedFromGroup',
            groupId: parseInt(groupId),
            userId: parseInt(memberId),
            content: `You have been removed from the group "${group.name}"`,
            timestamp: new Date().toISOString()
        });

        return res.status(200).json({
            success: true,
            message: 'Member removed successfully'
        });
    } catch (error) {
        console.error('Error removing member:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to remove member',
            error: error.message
        });
    }
};

/**
 * Get group suggestions for a user
 */
exports.getGroupSuggestions = async (req, res) => {
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

        // Get user's interests and location
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                expertise: true,
                location: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get IDs of groups the user is already a member of
        const userGroupIds = await prisma.groupMember.findMany({
            where: { userId },
            select: { groupId: true }
        });

        const groupIdsToExclude = userGroupIds.map(g => g.groupId);

        // Find groups with similar interests or location
        const suggestions = await prisma.group.findMany({
            where: {
                id: { notIn: groupIdsToExclude.length > 0 ? groupIdsToExclude : [-1] },
                OR: [
                    { category: { in: user.expertise } },
                    { name: { contains: user.location, mode: 'insensitive' } },
                    { description: { contains: user.location, mode: 'insensitive' } }
                ]
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        profileImg: true
                    }
                },
                _count: {
                    select: { members: true }
                }
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Count total suggestions for pagination
        const totalCount = await prisma.group.count({
            where: {
                id: { notIn: groupIdsToExclude.length > 0 ? groupIdsToExclude : [-1] },
                OR: [
                    { category: { in: user.expertise } },
                    { name: { contains: user.location, mode: 'insensitive' } },
                    { description: { contains: user.location, mode: 'insensitive' } }
                ]
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Group suggestions retrieved successfully',
            data: suggestions,
            pagination: {
                total: totalCount,
                page,
                limit,
                pages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching group suggestions:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch group suggestions',
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