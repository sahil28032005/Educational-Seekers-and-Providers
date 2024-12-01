// Import Prisma Client
const prisma = require('../config/prismaClient');

// Controller for filtering users
// exports.getFilteredConnections = async (req, res) => {
//     try {
//         // Extract filters from the query parameters
//         const { role, location, minBudget, maxBudget } = req.query;

//         // Build dynamic `where` filters
//         const filters = {
//             ...(role && { role: { contains: role, mode: 'insensitive' } }),
//             ...(location && { location: { contains: location, mode: 'insensitive' } }),
//             ...(minBudget && { budget: { gte: parseFloat(minBudget) } }),
//             ...(maxBudget && { budget: { lte: parseFloat(maxBudget) } }),
//         };

//         // Fetch connections based on filters
//         const connections = await prisma.user.findMany({
//             where: filters,
//             select: {
//                 id: true,
//                 name: true,
//                 role: true,
//                 location: true,
//                 budget: true,
//                 profileImg: true,
//                 bio: true,
//             },
//         });

//         // Return filtered connections
//         res.status(200).json({
//             success: true,
//             data: connections,
//         });
//     } catch (error) {
//         console.error("Error fetching filtered connections:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch connections.",
//         });
//     }
// };
exports.getFilteredConnections = async (req, res) => {
    try {
        // Extract filters from the query parameters
        const { role, location, minBudget, maxBudget, excludeUserId } = req.query;

        // Build dynamic `where` filters
        const filters = {
            ...(role && { role: { contains: role, mode: 'insensitive' } }),
            ...(location && { location: { contains: location, mode: 'insensitive' } }),
            ...(minBudget && { budget: { gte: parseFloat(minBudget) } }),
            ...(maxBudget && { budget: { lte: parseFloat(maxBudget) } }),
            ...(excludeUserId && { id: { not: parseInt(excludeUserId) } }),  // Exclude current user
        };

        // Fetch connections based on filters
        const connections = await prisma.user.findMany({
            where: filters,
            select: {
                id: true,
                name: true,
                role: true,
                location: true,
                budget: true,
                profileImg: true,
                bio: true,
            },
        });

        // Return filtered connections
        res.status(200).json({
            success: true,
            data: connections,
        });
    } catch (error) {
        console.error("Error fetching filtered connections:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch connections.",
        });
    }
};