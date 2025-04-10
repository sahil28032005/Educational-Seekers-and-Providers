import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router";

export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        if (token && userId) {
            const newSocket = io("http://localhost:3000", {
                query: { userId, token }
            });

            newSocket.on("connect", () => {
                console.log("Socket reconnected successfully.");
                newSocket.emit("register", userId); // Pass the userId to register the user
                console.log(`Registering user with ID: ${userId}`);

                // Listen for the server response
                newSocket.on("registered", (response) => {
                    if (response.success) {
                        console.log("User registered successfully:", response.message);
                        // Don't navigate here, it can cause issues
                    } else {
                        console.error("Registration failed:", response.message);
                        setError("Registration failed. Please try again.");
                    }
                });
            });

            newSocket.on("connect_error", (error) => {
                console.log("Socket connection error:", error);
            });

            // Remove the notification listener from here
            // Let SocketNotificationListener handle this

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        } else {
            console.error("Missing token or userId in localStorage. Cannot connect socket.");
        }
    }, [navigate]);

    return socket; // Just return the socket object directly
};
