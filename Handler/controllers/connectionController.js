const prisma = require('../config/prismaClient');
const { kafka, producer, initProducer } = require('../config/kafkaClient');
exports.createConnection = async (req, res) => {
    //firstly connect producer to kafka borker so it will send notificarions to them
    initProducer();


    const { requesterId, receiverId } = req.body;
    // const producer = kafka.producer();
    try {

        //first send notification
        //here suppose connection to be created now send throughput using high thhroughput services like kafka reddis pub sub or rabbit mq or bull mq etc..
        const requester = await prisma.user.findUnique({
            where: {
                id: parseInt(requesterId), // the requester's ID (usually passed as a variable)
            },
        });

        console.log("requester", requester);

        if (requester) {
            await sendNotification('connection-status', {
                type: 'connectionRequest',
                requesterId,
                receiverId,
                content: `User ${requester.name} sent you a connection request`,
            });
        }
        else {
            console.log("user not found");
        }


        //first check is this erquest already present in records 
        // Check if a connection already exists between the requester and receiver
        const existingConnection = await prisma.connection.findFirst({
            where: {
                requesterId: parseInt(requesterId, 10),
                receiverId: parseInt(receiverId, 10),
            },
        });

        if (existingConnection) {
            // Log that the connection request already exists
            console.log(`Connection request already exists between user ${requesterId} and user ${receiverId}`);

            // Skip creating the connection and just return a success message
            return res.status(200).send({
                success: true,
                message: 'Connection request already exists',
            });
        }
        // otherwise make connectiion recors to keep track of connections
        //i think creating a connection is not too much high throughput based task so i can add connection details in database like postgres
        const connection = await prisma.connection.create({
            data: {
                requesterId: parseInt(requesterId, 10),
                receiverId: parseInt(receiverId, 10)
            }
        });

        //update connection state as request sent


        // Now retrieve the connection with associated User data
        const populatedConnection = await prisma.connection.findUnique({
            where: { id: connection.id }, // Find the created connection by its ID
            include: {
                User: true, // Include the related User data (requester)
            },
        });




        //it will be an real time notification as connection was made store its entry in database also as it will be low prioritized
        // await prisma.notification.create({
        //     data: {
        //         userId: receiverId,
        //         type: 'connectionRequest',
        //         content: `User ${requesterId} sent you a connection request`
        //     }
        // });

        res.status(201).send({
            success: true,
            message: 'connection request was sent',
            data: connection
        });
    }
    catch (err) {
        return res.status(500).send({
            success: false,
            message: 'error from api for make connection',
            error: err.message
        });
    }


}

//updation connection status
exports.updateConnectionStatus = async (req, res) => {
    try {
        const { connectionId, status } = req.body;
        const connection = await prisma.connection.update({
            where: { id: parseInt(connectionId) },
            data: { status },
        });

        //for sending notifications use kafka decided

        //notify both user about connection status of their connection
        const { requesterId, receiverId } = connection;
        await sendNotification('connection-status', {
            type: 'connectionStatusUpdate',
            connectionId,
            status,
            requesterId,
            receiverId,
            content: `Connection status updated to ${status}`,
        });

        //use reddis for temprory storing unnecessary notifications like connection request sent ,receive accepted



    }
    catch (err) {

    }
}

//helper function to send notification
const sendNotification = async (topic, message) => {
    try {
        await producer.send({
            topic,
            messages: [{
                value: JSON.stringify(message),
            }]
        });

        console.log(`Sent notification to ${topic}:`, message);
    }
    catch (err) {
        console.error('Failed to send notification:', err.message);
    }
}

//get prnding requests in seperate section

exports.getPendingConnections = async (req, res) => {
    try {
        const userId = req.userId; //expects userId in the middleware

        //fetch prmding request for logged user
        const pendingConnections = await prisma.connection.findMany({
            where: {
                receiverId: userId,
                status: 'pending',
            },
            include: {
                User: true, //as this is not necessary yet
            }
        });

        res.status(200).send({
            success: true,
            data: pendingConnections
        });


    }
    catch (err) {
        res.status(404).send({
            success: false,
            message: 'failed to fetch pending connections',
            err: err.message
        });
    }
}
// (async () => {
//     const producer = kafka.producer();
//     await producer.connect();
//     console.log("producer connection successfull will be be able to publis logs");
// })();