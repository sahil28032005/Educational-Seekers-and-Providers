import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ConnectionsGrid = ({ connections, userId, defaultProfileImage, onConnect }) => {
  // Function to render the appropriate button based on connection status
  const renderConnectionButton = (connection) => {
    switch (connection.status) {
      case "Accepted":
        return (
          <Button 
            variant="outline" 
            className="bg-green-50 text-green-600 border-green-200" 
            disabled
          >
            Connected
          </Button>
        );
      case "Pending":
        return (
          <Button 
            variant="outline" 
            className="bg-gray-100 text-gray-500" 
            disabled
          >
            Request Sent
          </Button>
        );
      default:
        return (
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onConnect(connection.id, connection.id)}
          >
            Connect
          </Button>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {connections.length > 0 ? (
        connections.map((connection) => (
          <Card key={connection.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={connection.profileImg || defaultProfileImage} />
                  <AvatarFallback>{connection.name ? connection.name.charAt(0) : "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{connection.name}</h3>
                  <p className="text-sm text-gray-500">{connection.location || "No location"}</p>
                </div>
              </div>
              
              <div className="mb-4">
                {connection.expertise && connection.expertise.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {connection.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No expertise listed</p>
                )}
              </div>
              
              <div className="flex justify-end">
                {renderConnectionButton(connection)}
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          No connections found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default ConnectionsGrid;