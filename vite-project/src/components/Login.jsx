import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "./Login.css";

const Login = () => {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Making a POST request using axios
            const response = await axios.post('http://localhost:4000/login', formData);

            // Handle success
            setLoading(false);
            setSuccess("Login successful!");
            
            // Store token and extract userId
            const token = response.data.token;
            localStorage.setItem("authToken", token);

            // Get userId from response if available, otherwise decode from token
            let userId;
            if (response.data.userId) {
                userId = response.data.userId;
            } else {
                // Decode the token to get the userId
                const decodedToken = jwtDecode(token);
                userId = decodedToken.userId;
            }

            // Store userId in localStorage
            localStorage.setItem("userId", userId);
            
            console.log("Logged in user ID:", userId);
            
            // Instead of connecting to socket here, just navigate to home page
            // The socket connection will be handled by the useSocket hook
            setTimeout(() => {
                navigate("/");
            }, 1000);
            
        } catch (error) {
            setLoading(false);
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

export default Login;
