import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDetailPageManager() {
  const [activeTab, setActiveTab] = useState('hotels');
  const [hotels, setHotels] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState(''); // 'hotel' or 'card'
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    duration: '',
    groupSize: '',
    mainImage: null,
    galleryImages: [],
    features: '',
    itinerary: '',
    includedServices: '',
    excludedServices: '',
    requirements: '',
    cancellationPolicy: '',
    highlights: '',
    testimonials: '',
    faq: '',
    bookingEnabled: true,
    featured: false,
    discountPercentage: '',
    discountDescription: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelsResponse, cardsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/hotels'),
        axios.get('http://localhost:5000/api/cards')
      ]);
      setHotels(hotelsResponse.data);
      setCards(cardsResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setEditType(type);
    setFormData({
      name: item.name || item.title || '',
      description: item.description || '',
      price: item.price || '',
      location: item.location || item.city || '',
      city: item.city || '',
      province: item.province || '',
      address: item.address || '',
      duration: item.duration || '',
      groupSize: item.groupSize || '',
      mainImage: null,
      galleryImages: item.images || [],
      features: item.features ? item.features.join(', ') : '',
      itinerary: item.itinerary || '',
      includedServices: item.includedServices || '',
      excludedServices: item.excludedServices || '',
      requirements: item.requirements || '',
      cancellationPolicy: item.cancellationPolicy || '',
      highlights: item.highlights || '',
      testimonials: item.testimonials || '',
      faq: item.faq || '',
      bookingEnabled: item.bookingEnabled !== false,
      featured: item.featured || false,
      discountPercentage: item.discountPercentage || '',
      discountDescription: item.discountDescription || ''
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const form = new FormData();
      
      // Add all form fields
      for (let key in formData) {
        if (key === 'galleryImages') {
          // Handle existing gallery images (strings) and new files
          if (formData[key] && formData[key].length > 0) {
            const existingImages = formData[key].filter(img => typeof img === 'string');
            const newImages = formData[key].filter(img => img instanceof File);
            
            // Add existing images as JSON
            if (existingImages.length > 0) {
              form.append('images', JSON.stringify(existingImages));
            }
            
            // Add new image files
            newImages.forEach((image) => {
              form.append('images', image);
            });
          }
        } else if (key === 'mainImage' && formData[key] instanceof File) {
          form.append('image', formData[key]);
        } else if (key === 'features') {
          if (formData[key]) {
            form.append(key, JSON.stringify(formData[key].split(',').map(item => item.trim())));
          }
        } else if (key === 'bookingEnabled' || key === 'featured') {
          form.append(key, formData[key].toString());
        } else if (key !== 'mainImage' && key !== 'galleryImages') {
          form.append(key, formData[key] || '');
        }
      }

      console.log('Submitting form data:', Object.fromEntries(form));

      const endpoint = editType === 'hotel' 
        ? `http://localhost:5000/api/hotels/${editingItem._id}`
        : `http://localhost:5000/api/cards/${editingItem._id}`;

      const response = await axios.put(endpoint, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('Update response:', response.data);
      setSuccess(`${editType === 'hotel' ? 'Hotel' : 'Tour'} updated successfully`);
      setShowEditModal(false);
      setEditingItem(null);
      fetchData();
    } catch (err) {
      console.error('Update error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || err.message || 'Failed to update item');
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'mainImage') {
      setFormData({ ...formData, mainImage: e.target.files[0] });
    } else if (e.target.name === 'galleryImages') {
      setFormData({ ...formData, galleryImages: Array.from(e.target.files) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const removeGalleryImage = (index) => {
    const newImages = formData.galleryImages.filter((_, i) => i !== index);
    setFormData({ ...formData, galleryImages: newImages });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Detail Page Manager</h1>
            <p className="text-gray-600">Manage hotel and tour detail pages with dynamic content and galleries</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center text-red-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="font-semibold">Update Failed</div>
              <div className="text-sm">{error}</div>
              <div className="text-xs mt-1">Check browser console for more details</div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center text-green-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('hotels')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'hotels'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hotel Detail Pages
          </button>
          <button
            onClick={() => setActiveTab('tours')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'tours'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tour Detail Pages
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'hotels' ? (
          hotels.map((hotel) => (
            <div key={hotel._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Image */}
              <div className="h-48 relative">
                <img
                  src={hotel.image
                    ? hotel.image.startsWith('/uploads/')
                      ? `http://localhost:5000${hotel.image}`
                      : hotel.image
                    : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleEdit(hotel, 'hotel')}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                
                {/* Gallery Count */}
                <div className="absolute bottom-2 left-2">
                  <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    {hotel.images?.length || 0} gallery images
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{hotel.city}, {hotel.province}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {renderStars(hotel.rating)}
                    <span className="ml-1 text-sm text-gray-600">({hotel.rating})</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">${hotel.price}</span>
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>Features: {hotel.amenities?.length || 0}</p>
                  <p>Room Types: {hotel.roomTypes?.length || 0}</p>
                  <p>Discounts: {hotel.discounts?.length || 0}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          cards.map((card) => (
            <div key={card._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Image */}
              <div className="h-48 relative">
                <img
                  src={card.image
                    ? card.image.startsWith('/uploads/')
                      ? `http://localhost:5000${card.image}`
                      : card.image
                    : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleEdit(card, 'card')}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                
                {/* Gallery Count */}
                <div className="absolute bottom-2 left-2">
                  <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    {card.images?.length || 0} gallery images
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{card.location}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">
                    <span>{card.duration}</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">${card.price}</span>
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>Group Size: {card.groupSize}</p>
                  <p>Features: {card.features?.length || 0}</p>
                  <p>Highlights: {card.highlights ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit {editType === 'hotel' ? 'Hotel' : 'Tour'} Detail Page: {editingItem.name}
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {editType === 'hotel' ? (
                    <>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="province"
                        placeholder="Province"
                        value={formData.province}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        name="duration"
                        placeholder="Duration (e.g., 3 days)"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="groupSize"
                        placeholder="Group Size (e.g., 6-12 people)"
                        value={formData.groupSize}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </>
                  )}
                </div>

                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Images</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image
                    </label>
                    <input
                      type="file"
                      name="mainImage"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gallery Images (4+ recommended)
                    </label>
                    <input
                      type="file"
                      name="galleryImages"
                      accept="image/*"
                      multiple
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  {/* Current Gallery Images */}
                  {formData.galleryImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.galleryImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                    <input
                      type="text"
                      name="features"
                      placeholder="Features (comma separated)"
                      value={formData.features}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                    <textarea
                      name="highlights"
                      placeholder="Key highlights and attractions"
                      value={formData.highlights}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Included Services</label>
                    <textarea
                      name="includedServices"
                      placeholder="What's included in the package"
                      value={formData.includedServices}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Excluded Services</label>
                    <textarea
                      name="excludedServices"
                      placeholder="What's not included"
                      value={formData.excludedServices}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                    <textarea
                      name="requirements"
                      placeholder="Special requirements or notes"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
                    <textarea
                      name="cancellationPolicy"
                      placeholder="Cancellation and refund policy"
                      value={formData.cancellationPolicy}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Additional Content */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Itinerary</label>
                    <textarea
                      name="itinerary"
                      placeholder="Detailed day-by-day itinerary"
                      value={formData.itinerary}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Testimonials</label>
                    <textarea
                      name="testimonials"
                      placeholder="Customer testimonials and reviews"
                      value={formData.testimonials}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">FAQ</label>
                    <textarea
                      name="faq"
                      placeholder="Frequently asked questions"
                      value={formData.faq}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="bookingEnabled"
                      checked={formData.bookingEnabled}
                      onChange={(e) => setFormData({ ...formData, bookingEnabled: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">Enable Booking</label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">Featured Item</label>
                  </div>

                  <div>
                    <input
                      type="number"
                      name="discountPercentage"
                      placeholder="Discount %"
                      value={formData.discountPercentage}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingItem(null);
                    }}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update {editType === 'hotel' ? 'Hotel' : 'Tour'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDetailPageManager; 