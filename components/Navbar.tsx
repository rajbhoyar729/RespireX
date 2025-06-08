'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useLanding } from '@/contexts/LandingContext';

interface NavbarProps {
  activeSection: string; // Changed from optional to required
}

const navItems = [
  { name: 'Home', href: '/#home' },
  { name: 'About', href: '/#about' },
  { name: 'Features', href: '/#features' },
  { name: 'Solution', href: '/#solution' },
];

export default function Navbar({ activeSection: propActiveSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { activeSection: contextActiveSection } = useLanding();

  const activeSection = propActiveSection || contextActiveSection; // Prioritize prop over context

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white text-xl font-bold">
              RespireX
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item px-3 py-2 rounded-md text-sm font-medium relative transition-colors duration-300 ${
                    activeSection === item.href.replace('/#', '') || (item.href === '/' && activeSection === 'home')
                      ? 'text-yellow-400'
                      : 'text-white hover:text-yellow-400'
                  }`}
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
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  activeSection === item.href.replace('/#', '') || (item.href === '/' && activeSection === 'home')
                    ? 'text-yellow-400'
                    : 'text-white hover:text-yellow-400'
                }`}
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
}

