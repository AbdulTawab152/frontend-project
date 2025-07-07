import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchTourDetails();
  }, [id]);

  const fetchTourDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/cards/${id}`);
      setTour(response.data);
    } catch (err) {
      setError('Failed to fetch tour details');
      console.error('Error fetching tour:', err);
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
      prev === (tour.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (tour.images?.length || 1) - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600 mb-4">Tour not found</div>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const images = tour.images && tour.images.length > 0 ? tour.images : [tour.image];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Image Gallery Grid */}
      <div className="relative bg-gradient-to-br from-gray-50 to-white">
        {images.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Gallery Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tour Gallery</h2>
              <p className="text-gray-600">Explore the amazing destinations and experiences</p>
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
                      ? `http://localhost:5000${image}`
                      : image}
                    alt={`${tour.name || tour.title} - Image ${index + 1}`}
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
                    <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
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
                  <div className="text-2xl font-bold text-green-600">{tour.features?.length || 0}</div>
                  <div className="text-sm text-gray-600">Features</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{tour.dates?.length || 0}</div>
                  <div className="text-sm text-gray-600">Available Dates</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{tour.duration}</div>
                  <div className="text-sm text-gray-600">Duration</div>
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

      {/* Tour Information */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.name || tour.title}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      {renderStars(tour.rating)}
                      <span className="ml-2 text-gray-600">({tour.rating}/5)</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{tour.location || tour.province}</span>
                  </div>
                  <p className="text-gray-600">{tour.description}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">${tour.price}</div>
                  <div className="text-sm text-gray-500">per person</div>
                </div>
              </div>

              {/* Tour Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{tour.duration}</div>
                  <div className="text-sm text-gray-500">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{tour.groupSize}</div>
                  <div className="text-sm text-gray-500">Group Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{tour.features?.length || 0}</div>
                  <div className="text-sm text-gray-500">Features</div>
                </div>
              </div>

              {/* Booking Status */}
              {tour.bookingEnabled === false && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-yellow-800 font-medium">Coming Soon - Bookings will be available soon!</span>
                  </div>
                </div>
              )}

              {/* Discount */}
              {tour.discountPercentage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 font-medium">{tour.discountDescription || 'Special Offer'}</span>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {tour.discountPercentage}% OFF
                    </span>
                  </div>
                </div>
              )}

              {/* Highlights */}
              {tour.highlights && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Highlights</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">{tour.highlights}</p>
                  </div>
                </div>
              )}

              {/* Features */}
              {tour.features && tour.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">What's Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tour.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {tour.itinerary && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Itinerary</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line">{tour.itinerary}</p>
                  </div>
                </div>
              )}

              {/* Included/Excluded Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {tour.includedServices && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 whitespace-pre-line">{tour.includedServices}</p>
                    </div>
                  </div>
                )}

                {tour.excludedServices && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Not Included</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 whitespace-pre-line">{tour.excludedServices}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements */}
              {tour.requirements && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">{tour.requirements}</p>
                  </div>
                </div>
              )}

              {/* Cancellation Policy */}
              {tour.cancellationPolicy && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Cancellation Policy</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700">{tour.cancellationPolicy}</p>
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {tour.testimonials && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">What Our Travelers Say</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 italic">"{tour.testimonials}"</p>
                  </div>
                </div>
              )}

              {/* FAQ */}
              {tour.faq && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Frequently Asked Questions</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line">{tour.faq}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book Your Tour</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">${tour.price}</span>
                </div>
                
                {tour.discountPercentage && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-green-600 font-semibold">-{tour.discountPercentage}%</span>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500 space-y-1">
                  <p>Duration: {tour.duration}</p>
                  <p>Group Size: {tour.groupSize}</p>
                  <p>Location: {tour.location || tour.province}</p>
                </div>
              </div>

              {tour.bookingEnabled !== false ? (
                <button
                  onClick={() => navigate('/booking', { state: { tourData: tour } })}
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
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
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
                ? `http://localhost:5000${images[currentImageIndex]}`
                : images[currentImageIndex]}
              alt={tour.name || tour.title}
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

export default TourDetailPage; 