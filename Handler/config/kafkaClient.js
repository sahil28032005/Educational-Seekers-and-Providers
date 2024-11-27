const { Kafka } = require("kafkajs");

//make configuration for kafka client
const config = {
    clientId: 'my-app-ownmade',
    brokers: ['localhost:9092']
}
const kafka = new Kafka(config);

//make producer for test 
module.exports={kafka};

//testing kafka is working or not
// (async () => {
//     const producer = kafka.producer();
//     await producer.connect();
//     console.log("producer connection successfull will be be able to publis logs");
// })();

