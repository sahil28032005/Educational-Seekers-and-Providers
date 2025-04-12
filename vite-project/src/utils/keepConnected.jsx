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
            console.log("Creating socket connection with userId:", userId);
            const newSocket = io("http://localhost:3000", {
                query: { userId, token }
            });

            newSocket.on("connect", () => {
                console.log("Socket connected successfully with ID:", newSocket.id);
            });

            newSocket.on("connect_error", (error) => {
                console.log("Socket connection error:", error);
                setError("Connection error. Please try again.");
            });

            // Handle logout event from server
            newSocket.on("logout", (message) => {
                console.log("Received logout event:", message);
                localStorage.removeItem("authToken");
                localStorage.removeItem("userId");
                navigate("/login");
            });

            setSocket(newSocket);

            return () => {
                console.log("Disconnecting socket");
                newSocket.disconnect();
            };
        } else {
            console.error("Missing token or userId in localStorage. Cannot connect socket.");
        }
    }, [navigate]);

    return socket;
};
