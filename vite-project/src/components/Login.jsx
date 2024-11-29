import { Button } from "@/components/ui/button";  // Assuming you're using ShadCN Button
import { Input } from "@/components/ui/input";    // ShadCN Input component
import { Label } from "@/components/ui/label";    // ShadCN Label component
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN Card components
import { useState } from "react";
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

            // You can process the response as needed, e.g., storing the token
            console.log(response.data);
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
