// src/components/pages/PendingRequestsPage.jsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input"; // Assuming Input is already set up in your components
import { Card } from "shadcn-ui";
import styles from "../styles/PendingRequests.css"; // Assuming CSS modules

const PendingRequestsPage = () => {
  // Sample data for pending requests
  const [requests, setRequests] = useState([
    { requestId: "1", requester: "John Doe", requestedAt: "2024-11-30" },
    { requestId: "2", requester: "Jane Smith", requestedAt: "2024-11-29" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Filter requests based on the search term
  const filteredRequests = requests.filter((request) =>
    request.requester.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heading}>Pending Requests</h1>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <Input
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Display the filtered requests */}
      <div className={styles.requestList}>
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Card className={styles.card} key={request.requestId}>
              <h3 className={styles.title}>Request ID: {request.requestId}</h3>
              <p className={styles.details}>Requested by: {request.requester}</p>
              <p className={styles.details}>Requested at: {request.requestedAt}</p>
            </Card>
          ))
        ) : (
          <p>No pending requests found.</p>
        )}
      </div>
    </div>
  );
};

export default PendingRequestsPage;
