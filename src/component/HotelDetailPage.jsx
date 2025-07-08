import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "https://project-backend-5sjw.onrender.com";

const HotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/hotels/${id}`);
      setHotel(response.data);
    } catch (err) {
      setError('Failed to fetch hotel details');
      console.error('Error fetching hotel:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (hotel.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (hotel.images?.length || 1) - 1 : prev - 1
    );
  };

  const calculateDiscountedPrice = (basePrice, discountPercentage) => {
    return basePrice - (basePrice * discountPercentage / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600 mb-4">Hotel not found</div>
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

  const images = hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.image];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Image Gallery Grid */}
      <div className="relative bg-gradient-to-br from-gray-50 to-white">
        {images.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Gallery Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Hotel Gallery</h2>
              <p className="text-gray-600">Explore our beautiful accommodations and facilities</p>
            </div>

            {/* Grid Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                    index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={image?.startsWith('/uploads/')
                      ? `${API_BASE_URL}${image}`
                      : image}
                    alt={`${hotel.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <div className="bg-white bg-opacity-90 rounded-full p-3">
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Image Counter */}
                  <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    {index + 1} / {images.length}
                  </div>

                  {/* Featured Badge for First Image */}
                  {index === 0 && (
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Featured
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Gallery Stats */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-6 bg-white rounded-2xl shadow-lg px-6 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{hotel.amenities?.length || 0}</div>
                  <div className="text-sm text-gray-600">Amenities</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{hotel.roomTypes?.length || 0}</div>
                  <div className="text-sm text-gray-600">Room Types</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Gallery Images</h3>
              <p className="text-gray-500">Gallery images will appear here when available</p>
            </div>
          </div>
        )}
      </div>

      {/* Hotel Information */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      {renderStars(hotel.rating)}
                      <span className="ml-2 text-gray-600">({hotel.rating}/5)</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{hotel.city}, {hotel.province}</span>
                  </div>
                  <p className="text-gray-600">{hotel.address}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">${hotel.price}</div>
                  <div className="text-sm text-gray-500">per night</div>
                </div>
              </div>

              {/* Booking Status */}
              {hotel.bookingEnabled === false && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-yellow-800 font-medium">Coming Soon - Bookings will be available soon!</span>
                  </div>
                </div>
              )}

              {/* Discounts */}
              {hotel.discounts && hotel.discounts.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Special Offers</h3>
                  <div className="space-y-2">
                    {hotel.discounts.map((discount, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-green-700">{discount.description}</span>
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {discount.percentage}% OFF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">About This Hotel</h3>
                <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
              </div>

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {hotel.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Types */}
              {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Room Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotel.roomTypes.map((roomType, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{roomType}</h4>
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group Tour Info */}
              {hotel.groupTourInfo && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Group Tour Information</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">{hotel.groupTourInfo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book Your Stay</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-semibold">${hotel.price}</span>
                </div>
                
                {hotel.discounts && hotel.discounts.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-green-700 mb-2">Available Discounts:</h4>
                    {hotel.discounts.map((discount, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{discount.description}</span>
                        <span className="text-green-600 font-semibold">-{discount.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {hotel.bookingEnabled !== false ? (
                <button
                  onClick={() => navigate('/hotel-booking', { state: { hotelData: hotel } })}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <img
              src={images[currentImageIndex]?.startsWith('/uploads/')
                ? `${API_BASE_URL}${images[currentImageIndex]}`
                : images[currentImageIndex]}
              alt={hotel.name}
              className="max-w-full max-h-full object-contain"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetailPage; 