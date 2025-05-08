const { Server } = require("socket.io");
// const { kafka, consumer } = require("./config/kafkaClient");
const { redis } = require('./config/reddisClient');
const jwt = require("jsonwebtoken"); // Required for JWT validation

//function will receive express server as an oaram
const startSocketServer = (server) => {

    //register user in reddis cashing layer
    const addUser = (userId, socketId) => {
        redis.set(`user:${userId}`, socketId);
    }
    const io = new Server(server, {
        cors: {
            origin: "*", // Adjust for your frontend's origin
            methods: ["GET", "POST"]
        }
    });

    //remove user
    const removeUser = (socketId) => {
        redis.keys("user:*", (err, keys) => {
            if (err) return console.error(err);
            keys.forEach((key) => {
                redis.get(key, (err, value) => {
                    if (value === socketId) {
                        redis.del(key);
                        console.log(`Removed user with socket ID: ${socketId}`);
                    }
                });
            });
        });
    };

    //manage connection and socket instances
    io.on('connection', async function (socket) {
        console.log("user connected with socket id: " + socket.id);

        try {
            //take handshake data here such as an userId and his tokens
            const { userId, token } = socket.handshake.query;
            
            // Check if token exists (userId might be undefined)
            if (!token) {
                socket.emit('auth_error', { message: 'Missing token' });
                socket.disconnect();
                console.log("Missing token. Disconnected.");
                return;
            }
            
            console.log("userId: " + userId);
            console.log("token: " + token);
            
            // Validate the token with error handling
            try {
                const decoded = jwt.verify(token, 'asjiye7638'); // Replace with your secret key
                const tokenUserId = decoded.id;
                console.log("User ID from token: " + tokenUserId);
                
                // If userId is provided, verify it matches the token
                // But if userId is undefined, just use the token's userId
                if (userId && parseInt(userId, 10) !== tokenUserId) {
                    socket.emit('auth_error', { message: 'User ID mismatch' });
                    socket.disconnect();
                    console.log("User ID mismatch. Disconnected.");
                    return;
                }
                
                // Use the ID from the token as the authenticated user ID
                const authenticatedUserId = tokenUserId;
                console.log(`Authenticated user ${authenticatedUserId}`);
                
                //here handle socket events
                
                //firstly fetch users pending as user is offline till now and her arrived online
                // Fetch pending notifications
                const pendingNotifications = await redis.lrange(`pending:notifications:${authenticatedUserId}`, 0, -1);
                
                // Send pending notifications
                pendingNotifications.forEach((notif) => {
                    const parsedNotif = JSON.parse(notif);
                    setTimeout(() => { 
                        socket.emit("notification", {
                            toastType: 'success',
                            title: parsedNotif.notification?.title || 'Pending Notification',
                            message: parsedNotif.notification?.message || 'You have a pending notification',
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            data: parsedNotif.data
                        }); 
                    }, 4000);
                });
                
                // Clear the pending notifications list
                redis.del(`pending:notifications:${userId}`);
                
            } catch (tokenError) {
                // Handle token verification errors gracefully
                if (tokenError.name === 'TokenExpiredError') {
                    console.log('Token expired for user:', userId);
                    socket.emit('token_expired', { message: 'Your session has expired, please login again' });
                } else {
                    console.log('Invalid token:', tokenError.message);
                    socket.emit('auth_error', { message: 'Invalid authentication token' });
                }
                socket.disconnect();
                return;
            }
            
            //when user connects to socket register him - this is now handled above
            //socket.on("register", function (userId) {
            //    //add user record as where connections are bring managerd
            //    addUser(userId, socket.id);
            //    console.log(`User ${userId} registered with socket ID: ${socket.id}`);
            //    
            //    // Notify the client
            //    socket.emit('registered', { success: true, message: "User registered successfully." });
            //});
            
            //manage disconnection events
            socket.on('disconnect', function () {
                console.log("user disconnected with socket id: " + socket.id);
                removeUser(socket.id);
                
                //emit an logout event and rempove that user form localstorage and treat that user as offline
                socket.emit('logout', { message: "You have been logged out due to disconnection." });
            });
            
        } catch (error) {
            // Global error handler for the connection event
            console.error('Error in socket connection handler:', error);
            socket.emit('error', { message: 'Server error occurred' });
            socket.disconnect();
        }
    });

    // Add global error handlers for the socket.io server
    io.engine.on('connection_error', (err) => {
        console.log('Connection error:', err);
    });

    return io;
}

module.exports = { startSocketServer };