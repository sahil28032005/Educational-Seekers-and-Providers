const prisma = require('../config/prismaClient');

// First, let's fix the Prisma query in the getFilteredConnections function
const getFilteredConnections = async (req, res) => {
  try {
    // Get the current user ID from the token or query parameter
    const currentUserId = parseInt(req.query.userId || req.user?.userId || 0);
    
    // Build filter conditions based on query parameters
    const filterConditions = buildFilterConditions(req.query);
    
    // Fetch connections based on filters
    const connections = await prisma.user.findMany({
      where: {
        // Only add the id filter if we have a valid currentUserId
        ...(currentUserId ? {
          id: {
            not: currentUserId // This was missing a value before
          }
        } : {}),
        ...filterConditions
      },
      select: {
        id: true,
        name: true,
        role: true,
        location: true,
        expertise: true,
        // Remove fields that don't exist in your schema
        // budget: true,
        // profileImg: true,
        // bio: true
      }
    });
    
    res.json({
      success: true,
      data: connections
    });
  } catch (error) {
    console.error("Error fetching filtered connections:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch filtered connections",
      error: error.message
    });
  }
};

// Helper function to build filter conditions
const buildFilterConditions = (queryParams) => {
  const conditions = {};
  
  // Add location filter if provided
  if (queryParams.location) {
    conditions.location = queryParams.location;
  }
  
  // Add role filter if provided
  if (queryParams.role) {
    conditions.role = queryParams.role;
  }
  
  // Add expertise filter if provided
  if (queryParams.expertise) {
    conditions.expertise = {
      has: queryParams.expertise
    };
  }
  
  return conditions;
};

module.exports = {
  getFilteredConnections
};
