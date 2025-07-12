import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "https://project-backend-5sjw.onrender.com";

function HotelBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const hotelData = location.state?.hotelData;
  
  const [bookingData, setBookingData] = useState({
    hotelId: hotelData?._id || '',
    hotelName: hotelData?.name || '',
    hotelCity: hotelData?.city || '',
    hotelImage: hotelData?.image || '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: '',
    roomTypePrice: 0,
    totalPrice: 0,
    basePrice: 0,
    discountAmount: 0,
    discountPercentage: 0,
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Calculate total price when dates, guests, or room type changes
  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        // Base price: $140 per night per person
        const basePricePerNight = 140;
        const basePrice = basePricePerNight * nights * bookingData.guests;
        
        // Apply 15% discount for multiple people (2 or more guests)
        let discountPercentage = 0;
        let discountAmount = 0;
        let finalPrice = basePrice;
        
        if (bookingData.guests >= 2) {
          discountPercentage = 15;
          discountAmount = (basePrice * discountPercentage) / 100;
          finalPrice = basePrice - discountAmount;
        }
        
        setBookingData(prev => ({ 
          ...prev, 
          totalPrice: finalPrice,
          basePrice: basePrice,
          discountAmount: discountAmount,
          discountPercentage: discountPercentage
        }));
      }
    }
  }, [bookingData.checkIn, bookingData.checkOut, bookingData.guests]);

  // Set initial hotel data
  useEffect(() => {
    if (hotelData && hotelData.roomTypes && hotelData.roomTypes.length > 0) {
      setBookingData(prev => ({
        ...prev,
        hotelId: hotelData._id,
        hotelName: hotelData.name,
        hotelCity: hotelData.city,
        hotelImage: hotelData.image
      }));
    }
  }, [hotelData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'roomType') {
      // Find the selected room type and update price
      const selectedRoomType = hotelData.roomTypes.find(room => room.name === value);
      setBookingData(prev => ({ 
        ...prev, 
        [name]: value,
        roomTypePrice: selectedRoomType ? selectedRoomType.price : 0
      }));
    } else {
      setBookingData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!bookingData.fullName || !bookingData.email || !bookingData.phone || 
        !bookingData.checkIn || !bookingData.checkOut || !bookingData.roomType) {
      setError('Please fill in all required fields including room type.');
      setLoading(false);
      return;
    }

    // Calculate nights
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bookings`, {
        ...bookingData,
        nights,
        bookingType: 'hotel',
        pricePerNight: 140,
        hotelInfo: {
          name: hotelData.name,
          city: hotelData.city,
          image: hotelData.image,
          amenities: hotelData.amenities,
          roomTypes: hotelData.roomTypes
        }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/hotel-bookings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!hotelData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600 mb-4">No hotel data found</div>
          <button 
            onClick={() => navigate('/hotels')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Book Your Hotel</h1>
          <p className="text-gray-600 text-lg">Complete your hotel reservation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hotel Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Hotel Details</h2>
            
            <div className="mb-6">
              <img 
                src={hotelData.image} 
                alt={hotelData.name}
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">{hotelData.name}</h3>
              <p className="text-gray-600 mb-2">{hotelData.city}, {hotelData.province}</p>
              <p className="text-gray-700 mb-4">{hotelData.description}</p>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < hotelData.rating ? 'opacity-100' : 'opacity-30'}>★</span>
                  ))}
                </div>
                <span className="text-gray-600">{hotelData.rating}/5</span>
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Amenities:</h4>
                <div className="flex flex-wrap gap-2">
                  {hotelData.amenities?.map((amenity, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing Information */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Pricing Information:</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Base Price:</span>
                      <span className="font-semibold text-blue-600">$140 per night per person</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Group Discount:</span>
                      <span className="font-semibold text-green-600">15% off for 2+ people</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      * Final price calculated based on number of guests and nights
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Types */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Available Room Types:</h4>
                <div className="space-y-3">
                  {hotelData.roomTypes?.map((roomType, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-800">{roomType.name}</h5>
                        <span className="text-green-600 font-semibold">${roomType.price}/night</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{roomType.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {roomType.features?.map((feature, featureIndex) => (
                          <span key={featureIndex} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Capacity: {roomType.capacity} guests</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Information</h2>
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Booking created successfully! Redirecting to bookings page...
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2 text-red-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Discount Notice */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">Special Discount!</h4>
                    <p className="text-sm text-green-700">
                      Book for 2 or more people and get a <span className="font-bold">15% discount</span> on your total booking!
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={handleInputChange}
                    min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Guests and Room Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <select
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                  <select
                    name="roomType"
                    value={bookingData.roomType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a room type</option>
                    {hotelData.roomTypes?.map(roomType => (
                      <option key={roomType.name} value={roomType.name}>
                        {roomType.name} - ${roomType.price}/night
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Customer Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={bookingData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special requests or preferences..."
                  />
                </div>
              </div>

              {/* Total Price */}
              {bookingData.totalPrice > 0 && (
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold text-gray-800">Total Price:</span>
                    <span className="text-2xl font-bold text-green-600">${bookingData.totalPrice}</span>
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="text-gray-800">${bookingData.basePrice}</span>
                    </div>
                    
                    {bookingData.discountAmount > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount ({bookingData.discountPercentage}%):</span>
                          <span className="text-red-600">-${bookingData.discountAmount}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <div className="flex justify-between font-semibold">
                            <span className="text-gray-800">Final Price:</span>
                            <span className="text-green-600">${bookingData.totalPrice}</span>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      {bookingData.checkIn && bookingData.checkOut && 
                        `${Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24))} nights × ${bookingData.guests} guests × $140/night`
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !bookingData.checkIn || !bookingData.checkOut || !bookingData.roomType || !bookingData.fullName || !bookingData.email || !bookingData.phone}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Booking...
                  </div>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelBooking; 