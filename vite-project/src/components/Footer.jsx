import React from 'react';
import { Github, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4">EduSeek</h3>
            <p className="text-blue-100 mb-4">Connecting learners with educational opportunities worldwide.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Courses</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Career</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="flex items-center mb-3">
              <Mail size={16} className="mr-2" />
              <a href="mailto:info@eduseek.com" className="text-blue-200 hover:text-white transition-colors">info@eduseek.com</a>
            </div>
            <p className="text-blue-100">123 Education St.<br />Learning City, ED 12345</p>
          </div>
        </div>
        
        <div className="border-t border-blue-600 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-blue-200">&copy; 2024 EduSeek. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;