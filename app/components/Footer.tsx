

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-lg mb-4">
          &copy; {new Date().getFullYear()} Respiratory Care. All rights reserved.
        </p>
        <p className="text-sm mb-4">
          Empowering early detection of respiratory diseases with AI technology.
        </p>
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#about" className="hover:text-yellow-400 transition duration-300">About</a>
          <a href="#features" className="hover:text-yellow-400 transition duration-300">Features</a>
          <a href="#contact" className="hover:text-yellow-400 transition duration-300">Contact</a>
        </div>
        <p className="text-sm">
          Follow us on:
        </p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <span className="text-yellow-400">Facebook</span>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <span className="text-yellow-400">Twitter</span>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <span className="text-yellow-400">LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
