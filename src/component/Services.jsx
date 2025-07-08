import React, { useState } from 'react';
import { Briefcase, HelpCircle, ChevronDown, ChevronUp, Globe2 } from 'lucide-react';

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

const Services = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (idx) => setOpenFaq(openFaq === idx ? null : idx);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      {/* Hero/About Section */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="flex justify-center mb-4">
          <Globe2 className="w-16 h-16 text-blue-700 drop-shadow-lg" />
        </div>
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4 drop-shadow-lg">Our Services</h1>
        <p className="text-xl text-gray-700 font-medium mb-2">Welcome to Group Tours Afghanistan! We connect you with the best group travel experiences, local guides, and custom adventures across Afghanistan.</p>
        <p className="text-md text-gray-500">Our mission is to make travel in Afghanistan safe, memorable, and accessible for everyone. Discover our services and get answers to your questions below.</p>
      </div>

      {/* Services Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          <div className="flex-1 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col items-center text-center hover:scale-105 transition-transform">
            <Briefcase className="w-12 h-12 text-blue-600 mb-3" />
            <h3 className="text-2xl font-bold text-blue-900 mb-2">Curated Group Tours</h3>
            <p className="text-gray-700">Join our expertly planned group tours to Afghanistan's most stunning destinations, led by experienced local guides.</p>
          </div>
          <div className="flex-1 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col items-center text-center hover:scale-105 transition-transform">
            <Globe2 className="w-12 h-12 text-blue-600 mb-3" />
            <h3 className="text-2xl font-bold text-blue-900 mb-2">Custom Travel Planning</h3>
            <p className="text-gray-700">We help you design your own adventure, from solo trips to private groups, tailored to your interests and needs.</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-100 p-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-2"><HelpCircle className="w-7 h-7 text-blue-500" /> Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-lg border border-blue-100 bg-white/70 shadow-sm">
              <button
                className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-blue-900 focus:outline-none hover:bg-blue-50 transition-colors rounded-lg"
                onClick={() => toggleFaq(idx)}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-gray-700 text-sm animate-fade-in-down">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services; 