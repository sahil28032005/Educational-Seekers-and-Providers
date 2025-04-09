import React from "react";
import ConnectionCard from "./ConnectionCard";

const ConnectionsGrid = ({ connections, userId, defaultProfileImage, onConnect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-gray-50">
      {connections.map((user) => (
        <ConnectionCard
          key={user.id}
          name={user.name}
          role={user.role}
          description={user.description}
          profileImage={user.profileImage || defaultProfileImage}
          status="connect"
          onConnect={() => onConnect(userId, user.id)}
        />
      ))}
    </div>
  );
};

export default ConnectionsGrid;