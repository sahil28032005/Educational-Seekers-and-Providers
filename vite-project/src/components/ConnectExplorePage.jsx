import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import HeroSection from "./HeroSection";
import Navbar from "./dashboard/Navbar";
import Sidebar from "./dashboard/Sidebar";
import DashboardContent from "./dashboard/DashboardContent";
import CommunityContent from "./dashboard/CommunityContent";
import { getDefaultAvatar } from "../utils/avatarUtils"; // Updated import path
import "./ConnectExplorePage.css";
import ExploreContent from "./dashboard/ExploreContent";
import GroupsContent from "./dashboard/GroupsContent";

const ConnectExplorePage = () => {
    const defaultAvatar = getDefaultAvatar();
    const [connections, setConnections] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "community", etc.
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || 'Student';
    const [groups, setGroups] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [groupSuggestions, setGroupSuggestions] = useState([]);
    
    // Fetch connections logic
    const fetchConnections = async () => {
        try {
            console.log('Fetching connections');
            const userId = localStorage.getItem('userId');
            const authToken = localStorage.getItem('authToken');
    
            if (!userId || !authToken) {
                console.error("User ID or auth token is not available in localStorage");
                return;
            }
    
            // First, get all users
            const response = await axios.get("http://localhost:4000/filter", {
                params: { excludeUserId: userId },
            });
    
            // Set connections with default "Connect" status first
            const usersWithDefaultStatus = response.data.data.map(user => ({
                ...user,
                status: "Connect"
            }));
            
            setConnections(usersWithDefaultStatus);
    
            try {
                // Then, try to get existing connections to check status
                const existingConnectionsResponse = await axios.get(
                    "http://localhost:4000/connections/all",
                    {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }
                );
    
                // Process the connections to include connection status
                const existingConnections = existingConnectionsResponse.data.data || [];
                const processedConnections = usersWithDefaultStatus.map(user => {
                    // Find if there's an existing connection with this user
                    const existingConnection = existingConnections.find(
                        conn => (conn.requesterId === parseInt(userId) && conn.receiverId === user.id) || 
                                (conn.receiverId === parseInt(userId) && conn.requesterId === user.id)
                    );
                    
                    // Set the connection status based on existing connection
                    let status = "Connect";
                    if (existingConnection) {
                        status = existingConnection.status.charAt(0).toUpperCase() + 
                                 existingConnection.status.slice(1); // Capitalize first letter
                    }
                    
                    return {
                        ...user,
                        status
                    };
                });
    
                setConnections(processedConnections);
            } catch (connectionError) {
                console.error("Error fetching connection status:", connectionError);
                // We already set connections with default status, so we can continue
            }
        } catch (error) {
            console.error("Error fetching connections:", error);
            toast.error("Failed to load connections. Please try again later.");
        }
    };

    // Fetch groups
    const fetchGroups = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.error("Authentication token not found");
                return;
            }

            // Fetch all groups
            const allGroupsResponse = await axios.get("http://localhost:4000/api/groups", {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setGroups(allGroupsResponse.data.data || []);

            // Fetch user's groups
            const userGroupsResponse = await axios.get("http://localhost:4000/api/groups/user", {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setUserGroups(userGroupsResponse.data.data || []);

            // Fetch group suggestions
            const suggestionsResponse = await axios.get("http://localhost:4000/api/groups/suggestions", {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setGroupSuggestions(suggestionsResponse.data.data || []);
        } catch (error) {
            console.error("Error fetching groups:", error);
            toast.error("Failed to load groups");
        }
    };

    // Handle filter apply
    const handleFilterApply = async (filters) => {
        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                console.error("User ID is not available in localStorage");
                return;
            }

            const response = await axios.get("http://localhost:4000/filter", {
                params: {
                    ...filters,
                    excludeUserId: userId,
                },
            });

            setConnections(response.data.data);
        } catch (error) {
            console.error("Failed to fetch filtered connections:", error);
        }
    };

    // Handle connect
    const handleConnect = async (id, receiverId) => {
        try {
            // Get the authentication token
            const authToken = localStorage.getItem('authToken');
            
            if (!authToken) {
                toast.error("You must be logged in to connect with others");
                return;
            }
            
            // Optimistically update UI
            setConnections((prevConnections) =>
                prevConnections.map((connection) =>
                    connection.id === id
                        ? { ...connection, status: "Pending" }
                        : connection
                )
            );
            const userId = localStorage.getItem('userId');
    
            // Include the auth token in the request headers
            const response = await axios.post("http://localhost:4000/connections/create", 
                {
                    requesterId: userId,
                    receiverId: receiverId,
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            );
    
            if (response.data.success) {
                toast.success("Connection request sent successfully!");
            } else {
                throw new Error(response.data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Failed to send connection request:", error);
            
            // Check if it's a database connection error
            const errorMessage = error.response?.data?.message || error.message;
            const isDatabaseError = errorMessage.includes("database") || 
                                   errorMessage.includes("prisma") || 
                                   error.name === "PrismaClientInitializationError";
            
            // Revert the UI state if the request fails
            setConnections((prevConnections) =>
                prevConnections.map((connection) =>
                    connection.id === id
                        ? { ...connection, status: "Connect" }
                        : connection
                )
            );
            
            // Show appropriate error message
            if (isDatabaseError) {
                toast.error("Database connection error. Please try again later.");
            } else {
                toast.error(errorMessage || "Failed to send connection request. Please try again.");
            }
        }
    };

    // Handle create group
    const handleCreateGroup = async (groupData) => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                toast.error("You must be logged in to create a group");
                return;
            }

            const response = await axios.post(
                "http://localhost:4000/api/groups",
                groupData,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            if (response.data.success) {
                toast.success("Group created successfully!");
                fetchGroups(); // Refresh groups list
            }
        } catch (error) {
            console.error("Failed to create group:", error);
            toast.error(error.response?.data?.message || "Failed to create group");
        }
    };

    // Handle join group
    const handleJoinGroup = async (groupId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                toast.error("You must be logged in to join a group");
                return;
            }

            const response = await axios.post(
                `http://localhost:4000/api/groups/${groupId}/join`,
                {},
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            if (response.data.success) {
                toast.success("Joined group successfully!");
                fetchGroups(); // Refresh groups list
            }
        } catch (error) {
            console.error("Failed to join group:", error);
            toast.error(error.response?.data?.message || "Failed to join group");
        }
    };

    // Fetch connections on component mount
    useEffect(() => {
        fetchConnections();
    }, []);

    // Fetch groups when the active tab is "groups"
    useEffect(() => {
        if (activeTab === "groups") {
            fetchGroups();
        }
    }, [activeTab]);

    // Render the appropriate content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardContent userName={userName} />;
            case "community":
                return (
                    <CommunityContent 
                        connections={connections}
                        userId={userId}
                        defaultProfileImage={defaultAvatar.fallback}
                        onConnect={handleConnect}
                        onFilterApply={handleFilterApply}
                    />
                );
            case "explore":
                return <ExploreContent />;
            case "groups":
                return (
                    <GroupsContent
                        groups={groups}
                        userGroups={userGroups}
                        groupSuggestions={groupSuggestions}
                        onCreateGroup={handleCreateGroup}
                        onJoinGroup={handleJoinGroup}
                        onRefreshGroups={fetchGroups}
                    />
                );
            default:
                return <div className="p-6">Content for {activeTab}</div>;
        }
    };

    // Update the return statement in your ConnectExplorePage component
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          userAvatar={defaultAvatar.fallback}
          userName={userName}
        />
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <main className="flex-grow pt-16 md:pl-64 transition-all duration-300">
          {renderContent()}
        </main>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
        />
      </div>
    );
};

export default ConnectExplorePage;
