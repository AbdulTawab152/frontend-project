import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between h-16 items-center">
          {/* Logo with Icon */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-white tracking-wide drop-shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.77 7.82 20 9 12.91l-5-3.64 5.91-.01L12 2z" />
            </svg>
            Group Tours
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-white font-medium hover:text-yellow-400 transition-colors duration-200">Home</Link>
            <Link to="/booking" className="text-white font-medium hover:text-yellow-400 transition-colors duration-200">Group Tours</Link>
            <Link to="/hotels" className="text-white font-medium hover:text-yellow-400 transition-colors duration-200">Hotels</Link>
            <Link to="/services" className="text-white font-medium hover:text-yellow-400 transition-colors duration-200">Services</Link>
            <Link to="/contact" className="text-white font-medium hover:text-yellow-400 transition-colors duration-200">Contact</Link>
            <Link to="/login" className="bg-yellow-400 text-blue-900 px-5 py-2 rounded-full font-semibold shadow hover:bg-yellow-300 transition-colors duration-200">Admin Login</Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4 bg-blue-900 bg-opacity-95 rounded-b-xl shadow animate-fade-in-down px-4 pt-4">
            <Link to="/" onClick={toggleMenu} className="block text-white font-medium hover:text-yellow-400 transition-colors">Home</Link>
            <Link to="/booking" onClick={toggleMenu} className="block text-white font-medium hover:text-yellow-400 transition-colors">Group Tours</Link>
            <Link to="/hotels" onClick={toggleMenu} className="block text-white font-medium hover:text-yellow-400 transition-colors">Hotels</Link>
            <Link to="/services" onClick={toggleMenu} className="block text-white font-medium hover:text-yellow-400 transition-colors">Services</Link>
            <Link to="/contact" onClick={toggleMenu} className="block text-white font-medium hover:text-yellow-400 transition-colors">Contact</Link>
            <Link to="/login" onClick={toggleMenu} className="block bg-yellow-400 text-blue-900 px-5 py-2 rounded-full font-semibold shadow hover:bg-yellow-300 w-fit transition-colors">Admin Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
