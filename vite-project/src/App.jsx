import { useState } from 'react'
import ModernNavbar from './components/ModernNavbar'
import ConnectExplorePage from './components/ConnectExplorePage';
import SignUpPage from './components/SignUpPage';
import Login from './components/Login';
function App() {
  const [count, setCount] = useState(0)
  //this is rendered as root
  return (
    <>
      {/* <ModernNavbar />

      <ConnectExplorePage />

      <footer className="bg-blue-600 text-white py-10 text-center">
        <p>&copy; 2024 YourBrand. All rights reserved.</p>
      </footer> */}
      {/* <SignUpPage /> */}
      <Login />
    </>
  )
}

export default App
