import { Button } from "@/components/ui/button";  // Assuming you're using ShadCN Button
import { Input } from "@/components/ui/input";    // ShadCN Input component
import { Label } from "@/components/ui/label";    // ShadCN Label component
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN Card components
import { io } from 'socket.io-client';  // Import socket.io-client
import { useState } from "react";
import { jwtDecode } from 'jwt-decode';



import axios from "axios"; // Import axios for making requests
import "./Login.css"; // Assuming you have a separate CSS file for styles

const Login = () => {
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

            console.log("decoded at client side",userId);

            // You can process the response as needed, e.g., storing the token
            console.log("Logged in user ID:", userId); // Now you can use the userId

            //make user online by connnecting with socket server 
            const socket = io("http://localhost:3000", {
                query: { userId, token } // Pass both userId and token in the query parameters
            });

            //listem on socket events
            socket.on('connect', () => {
                console.log('Socket connection successful');

                // Navigate to the main page after successful connection
                navigate("/main"); // Replace "/main" with your actual route

                // You can now listen for other socket events (e.g., notifications)
                socket.on('notification', (message) => {
                    console.log("Notification:", message);
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
        </div>
    );
};

export default Login;
