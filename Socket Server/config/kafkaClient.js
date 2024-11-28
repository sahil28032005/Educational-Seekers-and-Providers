const { Kafka } = require("kafkajs");
const { redis } = require("./reddisClient");

//make configuration for kafka client
const config = {
    clientId: 'my-app-ownmade',
    brokers: ['localhost:9092']
}
const kafka = new Kafka(config);

const consumer = kafka.consumer({ groupId: 'notification-group' });

//this function will take socket instance to emit message ater cime as we have to send message to particular user
const initConsumer = async (io) => {
    await consumer.connect();
    console.log('consumer is in touch with kafka brocker and trying to suscribe...');
    await consumer.subscribe({ topic: 'connection-status', fromBeginning: false });
    console.log("suscribed to notification receiver channel");

    //run consumer to receive actual notifcations real time
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value.toString();
            console.log(`Received message: ${value}`);

            //this point is on load and has too much notification traffice it have to distribute this notification by classifying to specific user
            const notification = JSON.parse(value);
            const { receiverId, content } = notification;

            redis.get(`user:${receiverId}`, async(err, socketId) => {
                if (err) return console.error(err);
                if (socketId) {
                    io.to(socketId).emit("notification", content);
                    console.log(`Sent notification to user ${userId}: ${content}`);
                } else {
                    console.log(`User ${userId} is not online`);
                    //here we need some storage for storing pending notificaion to send when user will come online he will receive that
                    await redisClient.lpush(`pending:notifications:${userId}`, JSON.stringify(notification));
                    console.log(`Saved notification for user ${userId}`);
                }
            });

        },
    })
}

//make producer for test 
module.exports = { kafka, consumer, initConsumer };


