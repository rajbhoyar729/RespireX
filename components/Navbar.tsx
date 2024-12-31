import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  activeSection: string;
}

const navItems = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Features', id: 'features' },
  { name: 'Solution', id: 'solution' },
];

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-transparent px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-white">RespireX</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className="nav-item px-3 py-2 rounded-md text-sm font-medium relative transition-colors duration-300 text-white hover:text-yellow-400"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <Link href="/login" className="text-white hover:text-yellow-400">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

