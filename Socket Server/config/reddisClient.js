const Redis = require("ioredis");

const redis = new Redis({
    port: 6379,
    host: "",//this will be redis host
    username: "default",
    password: "my secret",
    db: 0, //defaults to 0
});
// Event listeners to verify connection
redis.once("connect", () => {
    console.log("Successfully connected to Redis!");
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});

redis.on("ready", () => {
    console.log("Redis connection is ready to use!");
});

module.exports = { redis };