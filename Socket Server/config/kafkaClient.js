const { Kafka } = require("kafkajs");

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
            console.log({
                value: message.value.toString(),
            })
        },
    })
}

//make producer for test 
module.exports = { kafka, consumer, initConsumer };


