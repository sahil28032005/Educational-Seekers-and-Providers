const express = require('express');
const {createConnection} = require("./controllers/connectionController");

const app = express();
const port = 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.post("/connect", createConnection);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


