import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConnectExplorePage from './components/ConnectExplorePage';
import SignUpPage from './components/SignUpPage';
import Login from './components/Login';
import { useSocket } from "./utils/keepConnected";
import { ToastProvider } from "@/components/ui/toast";
import PendingRequestsPage from './components/pendingRequestsPage';
import Footer from './components/Footer';

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
          <div className="flex flex-col min-h-screen">
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
        </Router>
      </ToastProvider>
    </>
  )
}

export default App
