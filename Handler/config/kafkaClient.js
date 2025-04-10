const { Kafka } = require('kafkajs');

// Create Kafka instance
const kafka = new Kafka({
    clientId: 'educational-seekers',
    brokers: ['localhost:9092']
});

// Initialize producer
let producer = null;

// Function to initialize producer
const initProducer = async () => {
    try {
        if (!producer) {
            producer = kafka.producer();
            await producer.connect();
            console.log('Kafka producer connected successfully');
        }
        return producer;
    } catch (error) {
        console.error('Failed to connect Kafka producer:', error);
        producer = null;
        return {
            send: async () => console.warn('Kafka unavailable, message not sent'),
            disconnect: async () => {}
        };
    }
};

// Function to publish events
const publishEvent = async (data) => {
    try {
        const currentProducer = await initProducer();
        if (!currentProducer) {
            console.warn('No Kafka producer available');
            return;
        }

        await currentProducer.send({
            topic: 'my-topic',  // Using the existing topic
            messages: [{ value: JSON.stringify(data) }]
        });
        console.log(`Event published to my-topic:`, data);
    } catch (error) {
        console.warn(`Failed to publish event:`, error.message);
    }
};

module.exports = {
    kafka,
    producer,
    initProducer,
    publishEvent
};


