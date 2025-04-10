const { Kafka } = require("kafkajs");
const { redis } = require("./reddisClient");

const config = {
    clientId: 'my-app-ownmade',
    brokers: ['localhost:9092']
}
const kafka = new Kafka(config);

const consumer = kafka.consumer({ groupId: 'notification-group' });

const initConsumer = async (io) => {
    await consumer.connect();
    console.log('consumer is in touch with kafka broker and trying to subscribe...');
    await consumer.subscribe({ topic: 'my-topic', fromBeginning: false });
    console.log("subscribed to my-topic channel");

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value.toString();
            console.log(`Received message: ${value}`);

            const notification = JSON.parse(value);
            const { receiverId } = notification;

            redis.get(`user:${receiverId}`, async(err, socketId) => {
                if (err) return console.error(err);
                if (socketId) {
                    console.log("found online!");
                    // Send a more structured notification event
                    io.to(socketId).emit("notification", {
                        toastType: 'success',
                        title: notification.notification?.title || 'New Connection Request',
                        message: notification.notification?.message || 'Someone wants to connect with you',
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        data: {
                            connectionId: notification.id,
                            requester: notification.requesterDetails,
                            status: notification.status,
                            createdAt: notification.createdAt
                        }
                    });
                    console.log(`Sent notification to user ${receiverId}`);
                } else {
                    console.log(`User ${receiverId} is not online`);
                    await redis.lpush(`pending:notifications:${receiverId}`, JSON.stringify({
                        ...notification,
                        timestamp: new Date().toISOString()
                    }));
                }
            });
        },
    });
};

module.exports = { kafka, consumer, initConsumer };


