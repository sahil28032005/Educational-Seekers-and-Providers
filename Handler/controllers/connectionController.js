const prisma = require('../config/prismaClient');
const { kafka, producer } = require('../config/kafkaClient');
exports.createConnection = async (req, res) => {
    const { requesterId, receiverId } = requesterId.body;
    const producer = kafka.producer();
    try {
        //i think creating a connection is not too much high throughput based task so i can add connection details in database like postgres
        const connection = await prisma.connection.create({
            data: {
                requesterId,
                receiverId
            }
        });


        //here suppose connection to be created now send throughput using high thhroughput services like kafka reddis pub sub or rabbit mq or bull mq etc..
        await sendNotification('notifier', {
            type: 'connectionRequest',
            requesterId,
            receiverId,
            content: `User ${requesterId} sent you a connection request`,
        });

        //it will be an real time notification as connection was made store its entry in database also as it will be low prioritized
        await prisma.notification.create({
            data: {
                userId: receiverId,
                typr: 'connectionRequest',
                content: `User ${requesterId} sent you a connection request`
            }
        });

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
            message: [{
                value: JSON.stringify(message),
            }]
        });

        console.log(`Sent notification to ${topic}:`, message);
    }
    catch (err) {
        console.error('Failed to send notification:', err.message);
    }
}

// (async () => {
//     const producer = kafka.producer();
//     await producer.connect();
//     console.log("producer connection successfull will be be able to publis logs");
// })();