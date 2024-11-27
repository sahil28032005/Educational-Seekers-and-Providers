const { Kafka } = require("kafkajs");

//make configuration for kafka client
const config = {
    clientId: 'my-app-ownmade',
    brokers: ['localhost:9092']
}
const kafka = new Kafka(config);

const consumer = kafka.consumer();

const initConsumer = async () => {
    await producer.connect({ groupId: 'notification-group' });
    console.log('kafka producer connected successfully to kafka broker');
}

//make producer for test 
module.exports = { kafka, producer };


