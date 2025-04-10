import { useState } from 'react';
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
        <Router>
          <AppContent />
          <Toaster />
        </Router>
      </ToastProvider>
    </>
  )
}

// Separate component to use hooks that require Router context
function AppContent() {
  const socket = useSocket();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Only render SocketNotificationListener if socket is valid */}
      {socket && typeof socket.on === 'function' && (
        <SocketNotificationListener socket={socket} />
      )}
      
      <div className="flex-grow">
        <Routes>
          {/* Define routes for different pages */}
          <Route path="/" element={<ConnectExplorePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pending" element={<PendingRequestsPage />} />
        </Routes>
      </div>
      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}

export default App;
