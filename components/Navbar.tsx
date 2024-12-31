<<<<<<< HEAD
'use client'

=======
import React from 'react';
>>>>>>> ecca23994d572172023c991bd71e3d3eada81f0c
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/#about' },
  { name: 'Features', href: '/#features' },
  { name: 'Solution', href: '/#solution' },
];

<<<<<<< HEAD
const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, []);

=======
interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
>>>>>>> ecca23994d572172023c991bd71e3d3eada81f0c
  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-transparent px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">RespireX</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
<<<<<<< HEAD
                  key={item.href}
                  href={item.href}
                  className="nav-item px-3 py-2 rounded-md text-sm font-medium relative transition-colors duration-300 text-white hover:text-yellow-400"
=======
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-item px-3 py-2 rounded-md text-sm font-medium relative transition-colors duration-300 text-white hover:text-yellow-400 ${activeSection === item.id ? 'text-yellow-400' : ''}`}
>>>>>>> ecca23994d572172023c991bd71e3d3eada81f0c
                >
                  {item.name}
                </Link>
              ))}
              {status === 'authenticated' ? (
                <>
                  <Link href="/dashboard" className="nav-item px-3 py-2 rounded-md text-sm font-medium relative transition-colors duration-300 text-white hover:text-yellow-400">
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="nav-item px-3 py-2 rounded-md text-sm font-medium relative transition-colors duration-300 text-white hover:text-yellow-400">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav-item px-3 py-2 rounded-md text-sm font-medium relative transition-colors duration-300 text-white hover:text-yellow-400">
                    Login
                  </Link>
                  <Link href="/register" className="nav-item px-3 py-2 rounded-md text-sm font-medium relative transition-colors duration-300 text-white hover:text-yellow-400">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-400"
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
            {status === 'authenticated' ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-400" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-400">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-400" onClick={toggleMenu}>
                  Login
                </Link>
                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-400" onClick={toggleMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

