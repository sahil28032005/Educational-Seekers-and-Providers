const express = require('express');
const { createConnection } = require("./controllers/connectionController");
const { register, login, getProfile } = require("./controllers/authController");
const authMiddleware = require("./middlewares/authMiddleware");
var cors = require('cors');

const app = express();
app.use(cors());
const port = 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.post("/connect", createConnection);

//auth routes specific
app.post('/register', register);
app.post('/login', login);
app.get('/profile', authMiddleware, getProfile);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


