import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import './ModernNavbar.css';
const ModernNavbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-lg px-6 py-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <div className="text-xl font-semibold text-blue-600">
          <a href="/" className="text-xl font-semibold text-blue-600">YourBrand</a>
        </div>

        {/* Navigation Links */}
        <div className="space-x-6 hidden md:flex">
          <a href="/" className="text-gray-800 hover:text-blue-500">Home</a>
          <a href="/explore" className="text-gray-800 hover:text-blue-500">Explore</a>
          <a href="/about" className="text-gray-800 hover:text-blue-500">About</a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            Menu
          </Button>
        </div>

        {/* Login Button */}
        <div className="hidden md:block">
          <Button className="bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Login
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white mt-4 space-y-4 p-4">
          <a href="/" className="block hover:text-blue-500">Home</a>
          <a href="/explore" className="block hover:text-blue-500">Explore</a>
          <a href="/about" className="block hover:text-blue-500">About</a>
        </div>
      )}
    </nav>
  );
};

export default ModernNavbar;
