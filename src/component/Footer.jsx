import React from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => (
  <footer className="bg-white/70 backdrop-blur-lg border-t border-blue-100 shadow-inner mt-16">
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row md: gap-32 items-center md:items-start">
      {/* Logo and About */}
      <div className="flex flex-col items-center md:items-start gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Globe2 className="w-8 h-8 text-blue-700" />
          <span className="text-2xl font-extrabold text-blue-900 tracking-wide">Group Tours</span>
        </div>
        <p className="text-gray-600 text-sm max-w-xs text-center md:text-left">Connecting you to Afghanistan's best group travel experiences, local guides, and custom adventures. Safe, memorable, and accessible journeys for all.</p>
        <div className="flex gap-3 mt-2">
          <a href="#" className="text-blue-500 hover:text-blue-700"><Facebook className="w-5 h-5" /></a>
          <a href="#" className="text-blue-500 hover:text-blue-700"><Twitter className="w-5 h-5" /></a>
          <a href="#" className="text-blue-500 hover:text-blue-700"><Instagram className="w-5 h-5" /></a>
        </div>
      </div>
      {/* Quick Links */}
      <div className="flex flex-col gap-2 items-center md:items-start">
        <h4 className="text-blue-800 font-semibold mb-2">Quick Links</h4>
        <Link to="/" className="text-blue-700 hover:underline">Home</Link>
        <Link to="/group-tours" className="text-blue-700 hover:underline">Group Tours</Link>
        <Link to="/hotels" className="text-blue-700 hover:underline">Hotels</Link>
        <Link to="/services" className="text-blue-700 hover:underline">Services</Link>
        <Link to="/contact" className="text-blue-700 hover:underline">Contact</Link>
      </div>
    </div>
    <div className="text-center text-gray-400 text-xs py-4 border-t border-blue-100 bg-white/60">&copy; {new Date().getFullYear()} Group Tours Afghanistan. All rights reserved.</div>
  </footer>
);

export default Footer; 