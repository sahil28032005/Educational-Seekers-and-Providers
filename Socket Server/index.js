const express = require('express');

const http = require('http');
const { startSocketServer } = require('./socketServer');
const { initConsumer } = require('./config/kafkaClient');

const app = express();

const server = http.createServer(app);

//start websocket server
const io = startSocketServer(server);

console.log("socker server initialized success and got io instance....");

//now we have actulla websocket instance

//inttialize kafka consumer as this is entry point to application
initConsumer(io); //socket instance is sent to init consumer because consummer will send notifications to pertucalar user using emmiter events

// satrt server call it as http/socket as it will managing both
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

