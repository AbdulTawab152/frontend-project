import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookingTable from './BookingTable';

const DEFAULT_HOTEL_IMAGE = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
const API_BASE_URL = "https://project-backend-5sjw.onrender.com";

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  tourDate: '',
  guests: 1,
  specialRequests: ''
};

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const hotelData = location.state?.hotelData || location.state?.tourData;
  
  const [form, setForm] = useState(initialState);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  // Calculate total price for tours
  useEffect(() => {
    if (hotelData?.price) {
      const basePrice = parseFloat(hotelData.price);
      const total = basePrice * form.guests;
      setTotalPrice(total);
    }
  }, [form.guests, hotelData?.price]);

  // Redirect if no hotel data
  useEffect(() => {
    if (!hotelData) {
      navigate('/');
    }
  }, [hotelData, navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (!form.fullName || !form.email || !form.phone || !form.tourDate) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const bookingData = {
        ...form,
        bookingType: 'tour',
        groupTourId: hotelData._id,
        hotelTitle: hotelData.title || hotelData.name,
        hotelPrice: hotelData.price,
        totalPrice: totalPrice,
        guests: form.guests
      };

      const res = await axios.post(`${API_BASE_URL}/api/bookings`, bookingData);
      setSuccess(`Booking successful! Confirmation: ${res.data.confirmation}`);
      setForm(initialState);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    }
  };

  // Star rating render
  const renderStars = (rating) => {
    const stars = [];
    for(let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-yellow-400 ${i <= rating ? 'opacity-100' : 'opacity-30'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Handle booking navigation
  const handleBookNow = (card) => {
    navigate('/booking', { state: { tourData: card } });
  };

  if (!hotelData) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hotel Information Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={hotelData.image 
                  ? hotelData.image.startsWith('/uploads/')
                    ? `${API_BASE_URL}${hotelData.image}`
                    : hotelData.image
                  : hotelData.images && hotelData.images.length > 0
                    ? hotelData.images[0].startsWith('/uploads/')
                      ? `${API_BASE_URL}${hotelData.images[0]}`
                      : hotelData.images[0]
                    : DEFAULT_HOTEL_IMAGE}
                alt={hotelData.title || hotelData.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full">
                  {hotelData.province || 'Afghanistan'}
                </span>
                {hotelData.rating !== undefined && (
                  <div className="flex items-center">
                    {renderStars(hotelData.rating)}
                    <span className="ml-2 text-sm text-gray-600">({hotelData.rating}/5)</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{hotelData.title || hotelData.name}</h1>
              <p className="text-gray-600 mb-4 leading-relaxed">{hotelData.description}</p>
              
              {hotelData.features && hotelData.features.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Features:</h3>
                  <div className="flex flex-wrap gap-2">
                    {hotelData.features.map((feature, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {hotelData.duration && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Duration:</span> {hotelData.duration}
                </p>
              )}
              
              {hotelData.dates && hotelData.dates.length > 0 && (
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Available Dates:</span> {hotelData.dates.join(", ")}
                </p>
              )}
              
              <div className="text-2xl font-bold text-red-500">
                ${hotelData.price} <span className="text-sm text-gray-500 font-normal">per person</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Tour Booking</h2>
          
          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
          {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">{success}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input 
                name="fullName" 
                value={form.fullName} 
                onChange={handleChange} 
                required 
                placeholder="Full Name*" 
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
              />
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                placeholder="Email*" 
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <input 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                required 
                placeholder="Phone Number*" 
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
              />
              <input 
                name="tourDate" 
                type="date" 
                value={form.tourDate} 
                onChange={handleChange} 
                required 
                placeholder="Tour Date*" 
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <input 
                name="guests" 
                type="number" 
                min="1" 
                max="20"
                value={form.guests} 
                onChange={handleChange} 
                required 
                placeholder="Number of Guests*" 
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
              />
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <span className="text-lg font-semibold text-gray-700">
                  {hotelData.duration || 'Tour Duration'}
                </span>
              </div>
            </div>
            
            <textarea 
              name="specialRequests" 
              value={form.specialRequests} 
              onChange={handleChange} 
              placeholder="Special Requests (Optional)" 
              rows="4"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
            />
            
            {/* Price Calculation */}
            {totalPrice > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Price Breakdown</h3>
                <div className="space-y-2 text-lg">
                  <div className="flex justify-between">
                    <span>Price per person:</span>
                    <span>${hotelData.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of guests:</span>
                    <span>{form.guests}</span>
                  </div>
                  <div className="border-t border-blue-300 pt-2 flex justify-between font-bold text-xl">
                    <span>Total Price:</span>
                    <span className="text-red-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Book Now - ${totalPrice.toFixed(2)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
