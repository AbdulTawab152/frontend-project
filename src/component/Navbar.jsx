import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronUp, HelpCircle, Briefcase } from 'lucide-react';
import Contact from './Contact';

const faqs = [
  {
    q: 'What services do you offer?',
    a: 'We offer curated group tours, travel planning, and local guide services across Afghanistan.'
  },
  {
    q: 'How can I book a service?',
    a: 'You can contact us through the website or visit the Group Tours page to book directly.'
  },
  {
    q: 'Are your tours safe?',
    a: 'Safety is our top priority. We work with trusted local partners and guides to ensure a secure experience.'
  },
  {
    q: 'Can I customize my tour?',
    a: 'Yes! We offer custom tour planning to fit your needs. Contact us for more details.'
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleServices = () => setShowServices((v) => !v);
  const toggleFaq = (idx) => setOpenFaq(openFaq === idx ? null : idx);

  return (
    <nav className="backdrop-blur-md bg-white/20 border-b border-white/30 shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between h-16 items-center">
          {/* Logo with Icon */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-blue-900 tracking-wide drop-shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.77 7.82 20 9 12.91l-5-3.64 5.91-.01L12 2z" />
            </svg>
            Group Tours
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/group-tours" className="nav-link">Group Tours</Link>
            <Link to="/hotels" className="nav-link">Hotels</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            {/* <Link to="/login" className="bg-blue-800 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-blue-900 transition-colors duration-200 border-2 border-blue-800 hover:border-blue-900">Admin Login</Link> */}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-blue-900 focus:outline-none">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4 bg-white/80 backdrop-blur-md rounded-b-xl shadow animate-fade-in-down px-4 pt-4 border border-white/30">
            <Link to="/" onClick={toggleMenu} className="mobile-nav-link">Home</Link>
            <Link to="/group-tours" onClick={toggleMenu} className="mobile-nav-link">Group Tours</Link>
            <Link to="/hotels" onClick={toggleMenu} className="mobile-nav-link">Hotels</Link>
            <Link to="/services" onClick={toggleMenu} className="mobile-nav-link">Services</Link>
            <Link to="/contact" onClick={toggleMenu} className="mobile-nav-link">Contact</Link>
            <Link to="/login" onClick={toggleMenu} className="block bg-blue-800 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-blue-900 w-fit transition-colors border-2 border-blue-800 hover:border-blue-900">Admin Login</Link>
          </div>
        )}
      </div>
      {/* Custom styles for nav links */}
      <style>{`
        .nav-link {
          position: relative;
          color: #1e3a8a;
          font-weight: 500;
          padding: 0.5rem 0.75rem;
          transition: color 0.2s;
        }
        .nav-link:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #1e3a8a, #3b82f6);
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.3s;
        }
        .nav-link:hover {
          color: #2563eb;
        }
        .nav-link:hover:after {
          transform: scaleX(1);
        }
        .mobile-nav-link {
          display: block;
          color: #1e3a8a;
          font-weight: 500;
          padding: 0.75rem 0;
          border-radius: 0.5rem;
          transition: background 0.2s, color 0.2s;
        }
        .mobile-nav-link:hover {
          background: #1e3a8a;
          color: #fff;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
