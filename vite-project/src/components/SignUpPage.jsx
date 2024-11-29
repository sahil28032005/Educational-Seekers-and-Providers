import { Button } from "@/components/ui/button";  // Assuming you're using ShadCN Button
import { Input } from "@/components/ui/input";    // ShadCN Input component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import necessary Select components
import { Label } from "@/components/ui/label";    // ShadCN Label component
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN Card components
import { Textarea } from "@/components/ui/textarea"; // ShadCN Textarea component
import { useState } from "react";
import "./SignUpPage.css"; // Assuming CSS file for styles

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        location: '',
        expertise: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted with:', formData);
    };

    const handleExpertiseChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            expertise: value.split(',').map(item => item.trim())
        });
    };

    return (
        <div className="signup-container">
            <Card className="signup-card">
                <CardHeader>
                    <h2 className="signup-title">Create an Account</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="form-group">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

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

                        <div className="form-group">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.role}
                                onChange={(e) => handleChange({ target: { name: 'role', value: e.target.value } })}
                                className="form-select"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="form-group">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <Label htmlFor="expertise">Expertise (comma separated)</Label>
                            <Textarea
                                id="expertise"
                                name="expertise"
                                value={formData.expertise.join(', ')}
                                onChange={handleExpertiseChange}
                                className="form-textarea"
                            />
                        </div>

                        <Button type="submit" className="submit-btn">Sign Up</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUp;
