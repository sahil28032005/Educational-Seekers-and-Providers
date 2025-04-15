const prisma = require('../config/prismaClient');

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    // Extract userId directly from the URL parameter
    let userId = req.params.userId;
    
    // For debugging
    console.log("Raw userId from params:", userId);
    console.log("Request params:", req.params);
    console.log("Request path:", req.path);
    console.log("Request query:", req.query);
    console.log("Authenticated user:", req.user);
    
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    // If userId is 'me' or undefined, use the authenticated user's ID
    if ((userId === 'me' || !userId) && req.user && req.user.userId) {
      userId = req.user.userId.toString();
      console.log("Using authenticated user's ID:", userId);
    }
    
    // Check if userId exists
    if (!userId) {
      // Try to get userId from query parameters
      userId = req.query.userId;
      console.log("Using userId from query:", userId);
      
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }
    }
    
    // Try to parse userId as an integer
    let userIdInt;
    try {
      userIdInt = parseInt(userId);
      if (isNaN(userIdInt)) {
        console.log("Failed to parse userId:", userId);
        throw new Error('Not a number');
      }
    } catch (error) {
      console.error('Error parsing userId:', error);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format',
        details: {
          providedId: userId,
          type: typeof userId
        }
      });
    }
    
    console.log("Parsed userId:", userIdInt);
    
    // Fetch user profile from database
    const user = await prisma.user.findUnique({
      where: {
        id: userIdInt
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        profileImg: true,
        location: true,
        budget: true,
        expertise: true,
        status: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Return the profile
    res.json({
      success: true,
      data: user
    });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user profile', 
      error: error.message 
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    // Extract userId directly from the URL parameter
    let userId = req.params.userId;
    const profileData = req.body;
    
    // For debugging
    console.log("Raw userId from params:", userId);
    console.log("Profile data:", profileData);
    
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    // Try to parse userId as an integer
    let userIdInt;
    try {
      userIdInt = parseInt(userId);
      if (isNaN(userIdInt)) {
        throw new Error('Not a number');
      }
    } catch (error) {
      console.error('Error parsing userId:', error);
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
    
    console.log("Parsed userId:", userIdInt);
    
    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: {
        id: userIdInt
      },
      data: {
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        expertise: profileData.expertise,
        // Only include these fields if they are provided
        ...(profileData.budget !== undefined && { budget: parseFloat(profileData.budget) }),
        ...(profileData.profileImg !== undefined && { profileImg: profileData.profileImg })
      }
    });
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update user profile', error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};