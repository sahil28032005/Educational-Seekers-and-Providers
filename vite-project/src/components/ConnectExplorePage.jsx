import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toast } from '@/components/ui/toast';
import { useState } from 'react';
import './ConnectExplorePage.css';
import FiltersPage from './FiltersPage';
import ConnectionCard from './ConnectionCard';
const ConnectExplorePage = () => {
    const handleConnect = (id) => {
        setConnections((prevConnections) =>
            prevConnections.map((connection) =>
                connection.id === id
                    ? {
                        ...connection,
                        status: connection.status === 'Connect' ? 'Request Sent' : 'Connected',
                    }
                    : connection
            )
        );
    };
    const demoUser = {
        id: 1,
        name: 'John Doe', // Full name of the user
        role: 'Full Stack Developer', // User's professional role
        description: 'Passionate about building scalable and robust web applications.', // Short bio
        profileImage: 'https://via.placeholder.com/150', // Profile image URL
        status: 'Connect', // Initial status of the connection
    };

    const [showToast, setShowToast] = useState(false);
    const [connections, setConnections] = useState([
        {
            id: 1,
            name: 'John Doe',
            role: 'Software Engineer',
            description: 'Building scalable applications.',
            profileImage: 'https://via.placeholder.com/100',
            status: 'Connect',
        },
        {
            id: 2,
            name: 'Jane Smith',
            role: 'UI/UX Designer',
            description: 'Designing user-centric experiences.',
            profileImage: 'https://via.placeholder.com/100',
            status: 'Connect',
        },
        {
            id: 3,
            name: 'Alice Johnson',
            role: 'Data Scientist',
            description: 'Turning data into insights.',
            profileImage: 'https://via.placeholder.com/100',
            status: 'Connect',
        },
    ]);

    const handleExploreClick = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // Hide the toast after 3 seconds
    };

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
                    <Button className="bg-blue-700 hover:bg-blue-800 text-white text-lg py-3 px-6 rounded-full shadow-lg" onClick={handleExploreClick}>
                        Start Exploring
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-screen-xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">Why Explore?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {/* Feature Cards */}
                        {[
                            { title: 'Discover New Projects', description: 'Find innovative projects that align with your interests.' },
                            { title: 'Connect with People', description: 'Engage with a global community of like-minded individuals.' },
                            { title: 'Get Inspired', description: 'Unlock your creativity by exploring exciting ideas.' },
                        ].map((feature, index) => (
                            <div key={index} className="text-center space-y-4">
                                <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300">
                                    <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</CardTitle>
                                    <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Explore Section */}
            <section className="py-20 bg-gray-100">
                <div className="max-w-screen-xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Featured Projects to Explore</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map((item, index) => (
                            <div key={index} className="group hover:scale-105 transition-all duration-300">
                                <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                    <CardDescription>
                                        <h3 className="text-lg font-semibold text-gray-800">Project {item}</h3>
                                        <p className="text-gray-600">
                                            An exciting project to explore. Learn about its features and how you can get involved.
                                        </p>
                                    </CardDescription>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-4">
                                        Explore Now
                                    </Button>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Toast Notification */}
            {showToast && (
                <Toast>
                    <p className="text-white font-semibold">Welcome to the Explorer!</p>
                </Toast>
            )}

            {/* filters */}
            <FiltersPage />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-gray-50">
                {connections.map((user) => (
                    <ConnectionCard
                        key={user.id}
                        name={user.name}
                        role={user.role}
                        description={user.description}
                        profileImage={user.profileImage}
                        status={user.status}
                        onConnect={() => handleConnect(user.id)}
                    />
                ))}
            </div>

        </div>
    );
};

export default ConnectExplorePage;
