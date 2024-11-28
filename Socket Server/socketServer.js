const { Server } = require("socket.io");
const { kafka, consumer } = require("./config/kafkaClient");
//function will receive express server as an oaram
const startSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Adjust for your frontend's origin
            methods: ["GET", "POST"]
        }
    });

    //manage connection and socket instances
    io.on('connection', function (socket) {
        console.log("user connected with socket id: " + socket.id);

        //here handle socket events

        //when user connects to socket register him
        socket.on("register", function (userId) {
            //add user record as where connections are bring managerd
            addUser(userId, socket.id); //i think reddis is good for amanaging volatiel connections ststuses and registrations as thhey are gonna temprory registrations
            console.log(`User ${userId} registered with socket ID: ${socket.id}`);
        });
        //manage disconnection events
        socket.on('disconnect', function () {
            console.log("user disconnected with socket id: " + socket.id);
        });
    });

    return io;
}

module.exports = {startSocketServer};