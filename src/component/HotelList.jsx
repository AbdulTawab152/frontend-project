import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DEFAULT_HOTEL_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";
const API_BASE_URL = "https://project-backend-5sjw.onrender.com";

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedRating, setSelectedRating] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const navigate = useNavigate();

  // Fetch all hotels
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/hotels`);
      setHotels(response.data);
      setFilteredHotels(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch hotels');
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Filter hotels based on selected criteria
  useEffect(() => {
    let filtered = [...hotels];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(hotel => hotel.price >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(hotel => hotel.price <= parseInt(priceRange.max));
    }

    // Rating filter
    if (selectedRating !== 'all') {
      const ratingValue = parseFloat(selectedRating);
      filtered = filtered.filter(hotel => hotel.rating >= ratingValue);
    }

    setFilteredHotels(filtered);
  }, [hotels, searchTerm, priceRange, selectedRating]);

  // Handle hotel selection
  const handleHotelSelect = (hotel) => {
    navigate('/hotel-booking', { state: { hotelData: hotel } });
  };

  // Handle hotel detail view
  const handleHotelDetail = (hotel) => {
    navigate(`/hotel/${hotel._id}`);
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



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Combined Header and Filters Section */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Perfect Hotel</h1>
            <p className="text-gray-600 text-lg mb-6">Discover amazing hotels across Afghanistan</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search hotels by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Additional Filters</h2>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <span className="text-sm text-gray-600 mr-2">View:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'list' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range ($)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Ratings</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="text-center w-full">
                  <p className="text-sm text-gray-600">Found</p>
                  <p className="text-2xl font-bold text-blue-600">{filteredHotels.length}</p>
                  <p className="text-sm text-gray-600">hotels</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <div className="flex items-center justify-center gap-2 text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Hotels Gallery */}
        {loading ? (
          // Placeholder hotels while loading
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
                {/* Image Placeholder */}
                <div className="h-64 bg-gray-200"></div>
                
                {/* Content Placeholder */}
                <div className="p-6">
                  <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="w-32 h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
                  
                  {/* Amenities Placeholder */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                    <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                    <div className="w-14 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                  
                  {/* Price and Buttons Placeholder */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="w-24 h-8 bg-gray-200 rounded mb-3"></div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hotels found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or city selection</p>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map((hotel, index) => (
              <div
                key={hotel._id}
                className="group bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-sm transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Section with Gallery */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={hotel.image
                      ? hotel.image.startsWith('/uploads/')
                        ? `${API_BASE_URL}${hotel.image}`
                        : hotel.image
                      : DEFAULT_HOTEL_IMAGE}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                      {hotel.city}
                    </span>
                    {hotel.bookingEnabled !== false && (
                      <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                        Available
                      </span>
                    )}
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center bg-white bg-opacity-95 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm">
                      {renderStars(hotel.rating)}
                      <span className="ml-1 text-sm font-semibold text-gray-700">{hotel.rating}</span>
                    </div>
                  </div>

                  {/* Gallery Count */}
                  {hotel.images && hotel.images.length > 0 && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {hotel.images.length} photos
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {hotel.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hotel.city}, {hotel.province}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{hotel.description}</p>
                  
                  {/* Amenities */}
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {hotel.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Room Types */}
                  {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Room Types:</p>
                      <div className="flex flex-wrap gap-1">
                        {hotel.roomTypes.slice(0, 2).map((type, index) => (
                          <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {typeof type === 'string' ? type : type.name}
                          </span>
                        ))}
                        {hotel.roomTypes.length > 2 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            +{hotel.roomTypes.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Discounts */}
                  {hotel.discounts && hotel.discounts.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {hotel.discounts.map((discount, index) => (
                          <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold">
                            {discount.percentage}% OFF
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                                    {/* Price and Action Buttons */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-green-600">$140</span>
                        <span className="text-sm text-gray-500">/night per person</span>
                        <div className="text-xs text-green-600 font-semibold mt-1">
                          15% off for 2+ people
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHotelDetail(hotel);
                        }}
                        className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-xl transform hover:scale-105"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleHotelSelect(hotel)}
                        className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-xl transform hover:scale-105"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-6">
            {filteredHotels.map((hotel, index) => (
              <div
                key={hotel._id}
                className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Section */}
                  <div className="relative md:w-1/3 h-64 md:h-auto overflow-hidden">
                    <img
                      src={hotel.image
                        ? hotel.image.startsWith('/uploads/')
                          ? `${API_BASE_URL}${hotel.image}`
                          : hotel.image
                        : DEFAULT_HOTEL_IMAGE}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {hotel.city}
                      </span>
                      {hotel.bookingEnabled !== false && (
                        <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          Available
                        </span>
                      )}
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm">
                        {renderStars(hotel.rating)}
                        <span className="ml-1 text-sm font-semibold text-gray-700">{hotel.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {hotel.name}
                        </h3>
                        <p className="text-gray-600 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {hotel.city}, {hotel.province}
                        </p>
                        
                        <p className="text-gray-700 mb-4">{hotel.description}</p>
                        
                        {/* Amenities */}
                        {hotel.amenities && hotel.amenities.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Amenities:</p>
                            <div className="flex flex-wrap gap-2">
                              {hotel.amenities.slice(0, 5).map((amenity, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                                  {amenity}
                                </span>
                              ))}
                              {hotel.amenities.length > 5 && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                  +{hotel.amenities.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                                             {/* Price and Actions */}
                       <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                         <div>
                           <span className="text-3xl font-bold text-green-600">$140</span>
                           <span className="text-sm text-gray-500">/night per person</span>
                           <div className="text-xs text-green-600 font-semibold mt-1">
                             15% off for 2+ people
                           </div>
                         </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHotelDetail(hotel);
                            }}
                            className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => handleHotelSelect(hotel)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelList; 