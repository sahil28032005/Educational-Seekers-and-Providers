const prisma = require('../config/prismaClient');

exports.createConnection = async (req, res) => {
    const { requesterId, receiverId } = requesterId.body;
    try {
        //i think creating a connection is not too much high throughput based task so i can add connection details in database like postgres
        const connection = await prisma.connection.create({
            data: {
                requesterId,
                receiverId
            }
        });

        //here suppose connection to be created now send throughput using high thhroughput services like kafka reddis pub sub or rabbit mq or bull mq etc..

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
        

        //use reddis for temprory storing unnecessary notifications like connection request sent ,receive accepted

        

    }
    catch (err) {

    }
}