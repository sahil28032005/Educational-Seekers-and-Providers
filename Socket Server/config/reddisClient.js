const Redis = require("ioredis");

const redis = new Redis({
    port: 6379,
    host: "",//this will be redis host
    username: "default",
    password: "my secret",
    db: 0, //defaults to 0
});

module.exports = { redis };