import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConnectExplorePage from './components/ConnectExplorePage';
import SignUpPage from './components/SignUpPage';
import Login from './components/Login';
import { useSocket } from "./utils/keepConnected";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import PendingRequestsPage from './components/pendingRequestsPage';
import Footer from './components/Footer';
import SocketNotificationListener from './components/SocketNotificationListener';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationProvider } from './context/NotificationContext';

// Make sure this import is at the top of your file
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ToastProvider>
        <NotificationProvider>
          <Router>
            <AppContent />
            <Toaster />
          </Router>
        </NotificationProvider>
      </ToastProvider>
    </>
  )
}
// In your AppContent function
function AppContent() {
  const socket = useSocket();
  
  // Add a useEffect to handle socket registration
  useEffect(() => {
    if (socket) {
      const userId = localStorage.getItem("userId");
      if (userId) {
        console.log("Registering user with socket server:", userId);
        socket.emit("register", userId);
        
        // Listen for registration confirmation
        socket.on("registered", (response) => {
          if (response.success) {
            console.log("Socket registration successful:", response.message);
          } else {
            console.error("Socket registration failed:", response.message);
          }
        });
        
        // Listen for token expiration
        socket.on("token_expired", (data) => {
          console.log("Token expired:", data.message);
          // Show toast notification
          import('react-toastify').then(({ toast }) => {
            toast.error(data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          });
          
          // Clear user authentication data
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          
          // Redirect to login page after a short delay
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        });
      }
    }
    
    return () => {
      if (socket) {
        socket.off("registered");
        socket.off("token_expired");
      }
    };
  }, [socket]);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Only render SocketNotificationListener if socket is valid */}
      {socket && <SocketNotificationListener socket={socket} />}
      
      <div className="flex-grow">
        <Routes>
          {/* Define routes for different pages */}
          <Route path="/" element={<ConnectExplorePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pending" element={<PendingRequestsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}

export default App;
