import { Button } from "@/components/ui/button";  // Assuming you're using ShadCN Button
import { Input } from "@/components/ui/input";    // ShadCN Input component
import { Label } from "@/components/ui/label";    // ShadCN Label component
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN Card components
import { io } from 'socket.io-client';  // Import socket.io-client
import { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the default styling



import axios from "axios"; // Import axios for making requests
import "./Login.css"; // Assuming you have a separate CSS file for styles

const Login = () => {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState(null); // Track error state
    const [success, setSuccess] = useState(null); // Track success state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Set loading state to true while making the request

        try {
            // Making a POST request using axios
            const response = await axios.post('http://localhost:4000/login', formData);

            // Handle success
            setLoading(false);  // Set loading to false when the request is complete
            setSuccess("Login successful!"); // Update the success state
            const token = response.data.token;
            localStorage.setItem("authToken", token);

            // Decode the token to get the userId
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;

            //store userId also in localstorage
            localStorage.setItem("userId", userId);

            console.log("decoded at client side", userId);

            // You can process the response as needed, e.g., storing the token
            console.log("Logged in user ID:", userId); // Now you can use the userId

            //make user online by connnecting with socket server 
            const socket = io("http://localhost:3000", {
                query: { userId, token } // Pass both userId and token in the query parameters
            });

            //listem on socket events
            socket.on('connect', () => {
                console.log('Socket connection successful');

                //after successful connectition call register event for same user as we have to keep track in redis of currentl online users
                // Emit the 'register' event after successful connection
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

                //for log out user by removing their cookies and metadata
                socket.on('logout', (data) => {
                    console.log(data.message); // Log the server's message
                    // Clear userId and token from localStorage
                    localStorage.removeItem("userId");
                    localStorage.removeItem("token");

                    // Optionally, redirect the user to the login page
                    navigate("/login");
                });

                // You can now listen for other socket events (e.g., notifications)
                socket.on('notification', (message) => {
                    // console.log("Notification:", message);
                    // setTimeout(() => {
                    //     toast.success(message); // Display success message
                    // }, 4000); // 4-second delay
                    toast.success(message); 
                });
            });

            // Handle socket connection error
            socket.on('connect_error', (error) => {
                console.log('Socket connection error:', error);
                setError('Unable to connect to the server. Please try again later.');
            });
        } catch (error) {
            setLoading(false);  // Set loading to false when the request fails
            setError(error.response?.data?.message || "An error occurred during login.");
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <CardHeader>
                    <h2 className="login-title">Sign In</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <Button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "Logging In..." : "Log In"}
                        </Button>
                    </form>

                    {/* Display success or error message */}
                    {success && <p className="success-message">{success}</p>}
                    {error && <p className="error-message">{error}</p>}
                </CardContent>
            </Card>

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

export default Login;
