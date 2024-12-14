"use client";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Features', id: 'Features' },
    { name: 'Solution', id: 'Solution' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleSetActive = (to: string) => {
    setActiveSection(to);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black bg-opacity-60 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="home"
              smooth={true}
              duration={500}
              className="text-2xl font-bold tracking-wider bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text cursor-pointer"
            >
              RespireX
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.id}
                  smooth={true}
                  duration={500}
                  spy={true}
                  offset={-64}
                  onSetActive={handleSetActive}
                  className={`px-3 py-2 rounded-md text-sm font-medium relative group cursor-pointer transition-all duration-300
                    ${activeSection === item.id 
                      ? 'text-yellow-400 font-semibold' 
                      : 'text-white hover:text-yellow-400'}`}
                >
                  {item.name}
                  <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-500 transform transition-transform duration-300
                    ${activeSection === item.id 
                      ? 'scale-x-100' 
                      : 'scale-x-0 group-hover:scale-x-100'} 
                    origin-left`}></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-400 focus:outline-none transition-colors duration-300"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black bg-opacity-90">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.id}
              smooth={true}
              duration={500}
              spy={true}
              offset={-64}
              onSetActive={handleSetActive}
              className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer transition-all duration-300
                ${activeSection === item.id 
                  ? 'text-yellow-400 bg-gray-900' 
                  : 'text-white hover:text-yellow-400 hover:bg-gray-800'}`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;