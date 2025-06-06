import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-md text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">RespireX</h3>
            <p className="text-gray-400">Revolutionizing respiratory health with AI-powered solutions.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="#home" className="hover:text-blue-400 transition duration-300">Home</Link></li>
              <li><Link href="#about" className="hover:text-blue-400 transition duration-300">About</Link></li>
              <li><Link href="#features" className="hover:text-blue-400 transition duration-300">Features</Link></li>
              <li><Link href="#solution" className="hover:text-blue-400 transition duration-300">Solutions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-400">Email: info@respirex.com</p>
            <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
            <div className="mt-4 flex space-x-4">
              {/* Social media links removed as they are not functional */}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} RespireX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

