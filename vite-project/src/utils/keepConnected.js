import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
        socket = io("http://localhost:3000", {
            query: { userId, token }
        });

        socket.on("connect", () => {
            console.log("Socket reconnected successfully.");
            socket.emit('register', userId); // Pass the userId to register the user
            console.log(`Registering user with ID: ${userId}`);

            // Listen for the server response
            socket.on('registered', (response) => {
                if (response.success) {
                    console.log('User registered successfully:', response.message);
                    navigate("/"); // Redirect to main page
                } else {
                    console.error('Registration failed:', response.message);
                    setError('Registration failed. Please try again.');
                }
            });
        });

        socket.on("connect_error", (error) => {
            console.log("Socket connection error:", error);
        });

        // Example event listeners
        socket.on("notification", (message) => {
            console.log("Notification:", message);
        });

        return socket;
    } else {
        console.error("Missing token or userId in localStorage. Cannot connect socket.");
    }
};

export const getSocket = () => socket;
