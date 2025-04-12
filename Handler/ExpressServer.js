const express = require('express');
const { createConnection, getPendingConnections } = require("./controllers/connectionController");
const { getFilteredConnections } = require("./controllers/filtersConntroller");
const { register, login, getProfile } = require("./controllers/authController");
const { 
    createGroup, 
    getAllGroups, 
    getGroupById, 
    joinGroup, 
    leaveGroup, 
    getUserGroups, 
    updateGroup, 
    deleteGroup, 
    changeMemberRole, 
    removeMember, 
    getGroupSuggestions 
} = require("./controllers/groupcontroller"); // Changed from ../controllers to ./controllers
const authMiddleware = require("./middlewares/authMiddleware");
const connectionRoutes = require('./routes/connectionRoutes');
var cors = require('cors');

const app = express();
app.use(cors());
const port = 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Use connection routes
app.use('/connections', connectionRoutes);

//filter controller routes
app.get("/filter", getFilteredConnections);

//auth routes specific
app.post('/register', register);
app.post('/login', login);
app.get('/profile', authMiddleware, getProfile);

// Group routes
app.post('/api/groups', authMiddleware, createGroup);
app.get('/api/groups', getAllGroups);
app.get('/api/groups/user', authMiddleware, getUserGroups);
app.get('/api/groups/suggestions', authMiddleware, getGroupSuggestions);
app.get('/api/groups/:groupId', getGroupById);
app.put('/api/groups/:groupId', authMiddleware, updateGroup);
app.delete('/api/groups/:groupId', authMiddleware, deleteGroup);
app.post('/api/groups/:groupId/join', authMiddleware, joinGroup);
app.delete('/api/groups/:groupId/leave', authMiddleware, leaveGroup);
app.patch('/api/groups/:groupId/members/:memberId/role', authMiddleware, changeMemberRole);
app.delete('/api/groups/:groupId/members/:memberId', authMiddleware, removeMember);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


