import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Send } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-sm border border-blue-100 p-8 mb-10">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2 text-center">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">We'd love to hear from you! Fill out the form or reach us directly using the info below.</p>
        <div className="flex flex-col md:flex-row gap-10">
          {/* Contact Info */}
          <div className="flex-1 flex flex-col gap-6 justify-center">
            <div className="flex items-center gap-3 text-blue-800">
              <Phone className="w-6 h-6" />
              <span className="font-semibold">+93 700 123 456</span>
            </div>
            <div className="flex items-center gap-3 text-blue-800">
              <Mail className="w-6 h-6" />
              <span className="font-semibold">info@grouptours.af</span>
            </div>
            <div className="flex items-center gap-3 text-blue-800">
              <MapPin className="w-6 h-6" />
              <span className="font-semibold">Kabul, Afghanistan</span>
            </div>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-blue-500 hover:text-blue-700"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-blue-500 hover:text-blue-700"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-blue-500 hover:text-blue-700"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="flex-1 bg-white/90 rounded-2xl shadow-sm p-6 flex flex-col gap-4 border border-blue-50">
            <div className="flex gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-1/2 rounded-lg border border-blue-200 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-1/2 rounded-lg border border-blue-200 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              />
            </div>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="rounded-lg border border-blue-200 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows={5}
              className="rounded-lg border border-blue-200 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all resize-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-blue-800 transition-all text-lg mt-2"
            >
              <Send className="w-5 h-5" /> Send Message
            </button>
            {submitted && (
              <div className="text-green-600 font-semibold mt-2">Thank you for contacting us! We'll get back to you soon.</div>
            )}
          </form>
        </div>
      </div>
      {/* Map or Illustration */}
      <div className="w-full max-w-4xl flex justify-center">
        <div className="w-full h-64 bg-gradient-to-tr from-blue-100 via-white to-purple-100 rounded-3xl shadow-inner flex items-center justify-center">
          <MapPin className="w-20 h-20 text-blue-300" />
          <span className="ml-4 text-blue-700 font-bold text-lg">Find us in Kabul, Afghanistan</span>
        </div>
      </div>
    </div>
  );
};

export default Contact; 