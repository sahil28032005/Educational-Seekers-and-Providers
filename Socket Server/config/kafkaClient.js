const { Kafka } = require("kafkajs");

//make configuration for kafka client
const config = {
    clientId: 'my-app-ownmade',
    brokers: ['localhost:9092']
}
const kafka = new Kafka(config);

const producer=kafka.producer();

const initProducer=async()=>{
    await producer.connect();
    console.log('kafka producer connected successfully to kafka broker');
}

//make producer for test 
module.exports={kafka,producer};


