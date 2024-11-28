const { Server } = require("socket.io");
const { kafka, consumer } = require("./config/kafkaClient");
const { redis } = require('./config/reddisClient');
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
        redisClient.keys("user:*", (err, keys) => {
            if (err) return console.error(err);
            keys.forEach((key) => {
                redisClient.get(key, (err, value) => {
                    if (value === socketId) {
                        redisClient.del(key);
                        console.log(`Removed user with socket ID: ${socketId}`);
                    }
                });
            });
        });
    };

    //manage connection and socket instances
    io.on('connection',async function (socket) {
        console.log("user connected with socket id: " + socket.id);

        //here handle socket events

        //firstly fetch users pending as user is offline till now and her arrived online
        // Fetch pending notifications
        const pendingNotifications = await redis.lrange(`pending:notifications:${userId}`, 0, -1);

        // Send pending notifications
        pendingNotifications.forEach((notif) => {
            const parsedNotif = JSON.parse(notif);
            socket.emit("notification", parsedNotif.content);
        });

        // Clear the pending notifications list
        await redis.del(`pending:notifications:${userId}`);

        //when user connects to socket register him
        socket.on("register", function (userId) {
            //add user record as where connections are bring managerd
            addUser(userId, socket.id); //i think reddis is good for amanaging volatiel connections ststuses and registrations as thhey are gonna temprory registrations
            console.log(`User ${userId} registered with socket ID: ${socket.id}`);
        });
        //manage disconnection events
        socket.on('disconnect', function () {
            console.log("user disconnected with socket id: " + socket.id);
            removeUser(socket.id);
        });
    });

    return io;
}

module.exports = { startSocketServer };