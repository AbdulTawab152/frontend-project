import React from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Facebook, Twitter, Instagram, Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';

const Footer = () => {
  const handleWhatsAppCall = () => {
    const phoneNumber = '+93700000000'; // Replace with actual WhatsApp number
    const message = 'Hello! I would like to inquire about group tours in Afghanistan.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="relative bg-gradient-to-br from-blue-50/80 via-white/80 to-purple-100/80 backdrop-blur-xl border-t border-blue-100 shadow-inner mt-16">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="rounded-3xl bg-white/80 shadow-sm p-8 md:p-12 flex flex-col gap-10 md:gap-0 md:flex-row md:divide-x divide-blue-100">
          {/* Logo and About */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-5 md:pr-10">
            <div className="flex items-center gap-2 mb-1">
              <Globe2 className="w-9 h-9 text-blue-700" />
              <span className="text-2xl font-extrabold text-blue-900 tracking-wide">Group Tours</span>
            </div>
            <p className="text-gray-600 text-sm max-w-xs text-center md:text-left">
              Connecting you to Afghanistan's best group travel experiences, local guides, and custom adventures. Safe, memorable, and accessible journeys for all.
            </p>
            <div className="flex gap-3 mt-2">
              {[{icon: Facebook, href: '#', color: 'bg-blue-100', hover: 'hover:bg-blue-600', iconColor: 'text-blue-600'},
                {icon: Twitter, href: '#', color: 'bg-blue-100', hover: 'hover:bg-blue-400', iconColor: 'text-blue-400'},
                {icon: Instagram, href: '#', color: 'bg-pink-100', hover: 'hover:bg-pink-500', iconColor: 'text-pink-500'}].map(({icon: Icon, href, color, hover, iconColor}, i) => (
                <a key={i} href={href} className={`w-9 h-9 rounded-full flex items-center justify-center ${color} ${hover} transition-all duration-200 group hover:scale-110`}>
                  <Icon className={`w-5 h-5 ${iconColor} group-hover:text-white transition-colors`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex-1 flex flex-col text-sm gap-3 md:px-10 items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              <h4 className="text-blue-800 font-bold text-lg">Quick Links</h4>
            </div>
            <Link to="/" className="text-blue-700 hover:text-blue-900 hover:underline transition-colors">Home</Link>
            <Link to="/group-tours" className="text-blue-700 hover:text-blue-900 hover:underline transition-colors">Group Tours</Link>
            <Link to="/hotels" className="text-blue-700 hover:text-blue-900 hover:underline transition-colors">Hotels</Link>
            <Link to="/services" className="text-blue-700 hover:text-blue-900 hover:underline transition-colors">Services</Link>
            <Link to="/contact" className="text-blue-700 hover:text-blue-900 hover:underline transition-colors">Contact</Link>
          </div>

          {/* Contact Information */}
          <div className="flex-1 flex flex-col gap-3 md:px-10 items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-blue-700" />
              <h4 className="text-blue-800 font-bold text-lg">Contact</h4>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-sm">+93 700 000 000</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-sm">info@grouptours.af</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Kabul, Afghanistan</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Mon-Sat: 9AM-6PM</span>
            </div>
            <button
              onClick={handleWhatsAppCall}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm mt-3 animate-pulse"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">WhatsApp Call</span>
            </button>
          </div>

          {/* Newsletter Signup */}
          <div className="flex-1 flex flex-col gap-4 md:pl-10 items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-5 h-5 text-blue-700" />
              <h4 className="text-blue-800 font-bold text-lg">Newsletter</h4>
            </div>
            <p className="text-gray-600 text-sm mb-2">Get travel tips, deals, and updates in your inbox.</p>
            <form className="flex w-full max-w-xs gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm bg-white/80"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200">
                Subscribe
              </button>
            </form>
            <div className="bg-blue-50 p-3 rounded-lg mt-2 text-xs text-blue-700">No spam. Unsubscribe anytime.</div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-blue-100 mt-8">
          {/* Safety & Security */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800">Safe Travel</h5>
              <p className="text-sm text-gray-600">Licensed guides & secure routes</p>
            </div>
          </div>

          {/* Local Experience */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800">Local Experience</h5>
              <p className="text-sm text-gray-600">Authentic cultural immersion</p>
            </div>
          </div>

          {/* Best Price */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800">Best Price</h5>
              <p className="text-sm text-gray-600">Guaranteed competitive rates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-400 text-xs py-4 border-t border-blue-100 bg-white/60">
        &copy; {new Date().getFullYear()} Group Tours Afghanistan. All rights reserved. | 
        <Link to="/privacy" className="hover:text-blue-600 ml-2">Privacy Policy</Link> | 
        <Link to="/terms" className="hover:text-blue-600 ml-2">Terms of Service</Link>
      </div>
    </footer>
  );
};

export default Footer; 