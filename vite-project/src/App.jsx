import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModernNavbar from './components/ModernNavbar'
import ConnectExplorePage from './components/ConnectExplorePage';
import SignUpPage from './components/SignUpPage';
import Login from './components/Login';
import { useSocket } from "./utils/keepConnected";
import { ToastProvider } from "@/components/ui/toast";
import PendingRequestsPage from './components/pendingRequestsPage';
function App() {
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   const socket = useSocket();
  //   return () => {
  //     if (socket) socket.disconnect();
  //   };
  // }, []);
  //this is rendered as root
  return (
    <>
      <ToastProvider>
        <Router>
          <ModernNavbar />
          <Routes>
            {/* Define routes for different pages */}
            <Route path="/" element={<ConnectExplorePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pending" element={<PendingRequestsPage />} />
          </Routes>
          <footer className="bg-blue-600 text-white py-10 text-center">
            <p>&copy; 2024 YourBrand. All rights reserved.</p>
          </footer>
        </Router>
      </ToastProvider>
    </>
  )
}

export default App
