import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the default styling
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import FiltersPage from "./FiltersPage";
import ConnectionCard from "./ConnectionCard";
import "./ConnectExplorePage.css";

const ConnectExplorePage = () => {
    const [connections, setConnections] = useState([]);  // Start with an empty array for connections
    const userId = localStorage.getItem('userId');
    const fetchConnections = async () => {
        try {
            console.log('Fetching connections');
            const userId = localStorage.getItem('userId');  // Get the current user's ID from localStorage

            if (!userId) {
                console.error("User ID is not available in localStorage");
                return;
            }

            // Make a request to the backend to fetch all users excluding the current user
            const response = await axios.get("http://localhost:4000/filter", {
                params: { excludeUserId: userId },  // Send the current user ID to exclude it
            });

            // Update state with the filtered connections (excluding the current user)
            setConnections(response.data.data);
        } catch (error) {
            console.error("Error fetching connections:", error);
        }
    };


    // const [connections, setConnections] = useState([
    //     {
    //         id: 2,
    //         name: "Jane Smith",
    //         role: "UI/UX Designer",
    //         description: "Designing user-centric experiences.",
    //         profileImage: "https://via.placeholder.com/100",
    //         status: "Connect",
    //         receiverId: 2,
    //     },
    //     {
    //         id: 3,
    //         name: "Alice Johnson",
    //         role: "Data Scientist",
    //         description: "Turning data into insights.",
    //         profileImage: "https://via.placeholder.com/100",
    //         status: "Connect",
    //         receiverId: 3,
    //     },
    //     {
    //         id: 4,
    //         name: "Michael Brown",
    //         role: "DevOps Engineer",
    //         description: "Ensuring smooth CI/CD pipelines.",
    //         profileImage: "https://via.placeholder.com/100",
    //         status: "Connect",
    //         receiverId: 4,
    //     },
    // ]);

    // filters applier
    const handleFilterApply = async (filters) => {
        try {
            // Retrieve the userId from localStorage
            const userId = localStorage.getItem('userId');  // Assuming 'userId' is the key in localStorage

            // Check if userId exists in localStorage
            if (!userId) {
                console.error("User ID is not available in localStorage");
                return;  // Optionally handle this case (e.g., redirect or show a message)
            }

            // Make the request with the filters and exclude the current user
            const response = await axios.get("http://localhost:4000/filter", {
                params: {
                    ...filters,
                    excludeUserId: userId,  // Pass the userId from localStorage
                },
            });

            // Update the state with filtered connections
            setConnections(response.data.data);
        } catch (error) {
            console.error("Failed to fetch filtered connections:", error);
        }
    };



    const handleConnect = async (id, receiverId) => {
        try {
            // Update UI state to "Request Sent" optimistically
            setConnections((prevConnections) =>
                prevConnections.map((connection) =>
                    connection.id === id
                        ? { ...connection, status: "Request Sent" }
                        : connection
                )
            );

            // Send connection request to backend
            const response = await axios.post("http://localhost:4000/connect", {
                requesterId: "1", // Replace with the actual requester ID
                receiverId: receiverId,
            });

            if (response.data.success) {
                toast.success("Connection request sent successfully!");  // Success toast
            } else {
                throw new Error(response.data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Failed to send connection request:", error);

        } finally {
            // Show toast notification


        }

    };
    // Empty dependency array to run only once when the component mounts
    useEffect(() => {
        fetchConnections();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24 text-center">
                <div className="max-w-screen-xl mx-auto px-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
                        Discover Endless Possibilities
                    </h1>
                    <p className="text-lg sm:text-xl mb-10">
                        Explore the world’s most innovative projects, connect with inspiring people, and fuel your creativity.
                    </p>
                    <Button
                        className="bg-blue-700 hover:bg-blue-800 text-white text-lg py-3 px-6 rounded-full shadow-lg"
                        onClick={() => {

                        }}
                    >
                        Start Exploring
                    </Button>
                </div>
            </section>

            {/* Filters and Connections */}
            <FiltersPage onFilterApply={handleFilterApply} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-gray-50">
                {connections.map((user) => (
                    <ConnectionCard
                        key={user.id}
                        name={user.name}
                        role={user.role}
                        description={user.description}
                        profileImage={user.profileImage}
                        status="connect"
                        onConnect={() => handleConnect(userId, user.id)}
                    />
                ))}
            </div>
            <ToastContainer
                position="top-right"   // Position of the toast notifications
                autoClose={5000}       // Duration for each toast to stay visible (in ms)
                hideProgressBar={false}  // Whether to show a progress bar
                newestOnTop={true}        // Whether to show the newest toast on top
                closeOnClick={true}       // Close the toast when clicked
                rtl={false}               // Set to true if you're using right-to-left text
            />

        </div>
    );
};

export default ConnectExplorePage;
