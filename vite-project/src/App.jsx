import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModernNavbar from './components/ModernNavbar'
import ConnectExplorePage from './components/ConnectExplorePage';
import SignUpPage from './components/SignUpPage';
import Login from './components/Login';
import { connectSocket } from './utils/keepConnected';
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const socket = connectSocket();
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);
  //this is rendered as root
  return (
    <>
      <Router>
        <ModernNavbar />
        <Routes>
          {/* Define routes for different pages */}
          <Route path="/" element={<ConnectExplorePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <footer className="bg-blue-600 text-white py-10 text-center">
          <p>&copy; 2024 YourBrand. All rights reserved.</p>
        </footer>
      </Router>
    </>
  )
}

export default App
