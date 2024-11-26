import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ConnectionCard = ({ name, role, description, profileImage, status, onConnect }) => {
    return (
        <Card className="p-6 shadow-lg rounded-lg transition-transform hover:scale-105 hover:shadow-xl duration-300 bg-white border border-gray-200">
            {/* Profile Section */}
            <div className="flex items-center space-x-4">
                <img
                    src={profileImage}
                    alt={`${name}'s profile`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
                />
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
                    <p className="text-sm text-gray-500">{role}</p>
                </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-gray-600">{description}</p>

            {/* Connect Button */}
            <Button
                className={`mt-6 w-full py-2 font-medium text-white rounded-md ${
                    status === 'Connected'
                        ? 'bg-green-600 hover:bg-green-700'
                        : status === 'Request Sent'
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
                onClick={onConnect}
            >
                {status}
            </Button>
        </Card>
    );
};

export default ConnectionCard;
