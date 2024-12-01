// src/components/pages/PendingRequestsPage.jsx
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; // Assuming Input is already set up in your components
import { Card } from "@/components/ui/card";
import styles from './PendingRequests.module.css';// Assuming CSS modules
import axios from "axios";

const PendingRequestsPage = () => {
  const [requests, setRequests] = useState([]); // Holds pending requests
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  //fetch oending requests here
  // Fetch pending requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get("http://localhost:4000/pending", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiamFuZUBleGFtcGxlLmNvbSIsImlhdCI6MTczMzAzOTE2NywiZXhwIjoxNzMzMDQyNzY3fQ.PruSQzYjtRsszmTFq7Zi7JpcLfb2OCO44WJNt-8Bl5A`, // Replace with your JWT token
          },
        });
        setRequests(response.data.data); // Set the fetched data
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch pending requests.");
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heading}>Pending Requests</h1>

      {/* Display the requests */}
      <div className={styles.requestList}>
        {requests.length > 0 ? (
          requests.map((request) => (
            <Card className={styles.card} key={request.id}>
              <h3 className={styles.title}>Request ID: {request.id}</h3>
              <p className={styles.details}>Requested by: {request.User?.name || "Unknown"}</p>
              <p className={styles.details}>
                Requested at: {new Date(request.createdAt).toLocaleDateString()}
              </p>
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
