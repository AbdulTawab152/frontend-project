import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminHotelManager() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    province: '',
    address: '',
    description: '',
    price: '',
    rating: '',
    image: null,
    images: [],
    amenities: '',
    roomTypes: '',
    discounts: [],
    groupTourInfo: '',
    bookingEnabled: true
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/hotels');
      setHotels(response.data);
    } catch (err) {
      setError('Failed to fetch hotels');
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name || '',
      city: hotel.city || '',
      province: hotel.province || '',
      address: hotel.address || '',
      description: hotel.description || '',
      price: hotel.price || '',
      rating: hotel.rating || '',
      image: null,
      images: hotel.images || [],
      amenities: hotel.amenities ? hotel.amenities.join(', ') : '',
      roomTypes: hotel.roomTypes ? hotel.roomTypes.join(', ') : '',
      discounts: hotel.discounts || [],
      groupTourInfo: hotel.groupTourInfo || '',
      bookingEnabled: hotel.bookingEnabled !== false
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/hotels/${id}`);
      setSuccess('Hotel deleted successfully');
      fetchHotels();
    } catch (err) {
      setError('Failed to delete hotel');
      console.error('Error deleting hotel:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const form = new FormData();
      
      // Add all form fields
      for (let key in formData) {
        if (key === 'images') {
          // Handle multiple images
          if (formData[key] && formData[key].length > 0) {
            formData[key].forEach((image, index) => {
              if (image instanceof File) {
                form.append(`images`, image);
              }
            });
          }
        } else if (key === 'image' && formData[key] instanceof File) {
          form.append(key, formData[key]);
        } else if (key === 'amenities' || key === 'roomTypes') {
          if (formData[key]) {
            form.append(key, JSON.stringify(formData[key].split(',').map(item => item.trim())));
          }
        } else if (key === 'discounts') {
          form.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'image' && key !== 'images') {
          form.append(key, formData[key]);
        }
      }

      console.log('Sending form data:', Object.fromEntries(form.entries()));
      await axios.put(`http://localhost:5000/api/hotels/${editingHotel._id}`, form);
      setSuccess('Hotel updated successfully');
      setShowEditModal(false);
      setEditingHotel(null);
      fetchHotels();
    } catch (err) {
      console.error('Update hotel error:', err);
      if (err.response?.data?.details) {
        setError(`Failed to update hotel: ${err.response.data.details.join(', ')}`);
      } else {
        setError(err.response?.data?.error || 'Failed to update hotel');
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else if (e.target.name === 'images') {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addDiscount = () => {
    setFormData({
      ...formData,
      discounts: [...formData.discounts, { description: '', percentage: '', minPeople: '' }]
    });
  };

  const updateDiscount = (index, field, value) => {
    const newDiscounts = [...formData.discounts];
    newDiscounts[index] = { ...newDiscounts[index], [field]: value };
    setFormData({ ...formData, discounts: newDiscounts });
  };

  const removeDiscount = (index) => {
    const newDiscounts = formData.discounts.filter((_, i) => i !== index);
    setFormData({ ...formData, discounts: newDiscounts });
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
          <p className="text-gray-600">Loading hotels...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Management</h1>
            <p className="text-gray-600">Manage hotel profiles, images, and booking settings</p>
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
            {error}
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

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
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
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(hotel)}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(hotel._id)}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              {/* Booking Status Badge */}
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  hotel.bookingEnabled !== false
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {hotel.bookingEnabled !== false ? 'Active' : 'Coming Soon'}
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

              {/* Discounts */}
              {hotel.discounts && hotel.discounts.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {hotel.discounts.map((discount, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {discount.percentage}% OFF
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-500">
                <p>{hotel.amenities?.length || 0} amenities</p>
                <p>{hotel.roomTypes?.length || 0} room types</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Hotel: {editingHotel.name}
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingHotel(null);
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
                    placeholder="Hotel Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                  <input
                    type="number"
                    name="price"
                    placeholder="Price per night"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    name="rating"
                    placeholder="Rating (0-5)"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <textarea
                  name="description"
                  placeholder="Hotel Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Hotel Images</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Images (Gallery)
                    </label>
                    <input
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                {/* Amenities and Room Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="amenities"
                    placeholder="Amenities (comma separated)"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="roomTypes"
                    placeholder="Room Types (comma separated)"
                    value={formData.roomTypes}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Discounts */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Discount Offers</h3>
                    <button
                      type="button"
                      onClick={addDiscount}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Discount
                    </button>
                  </div>
                  
                  {formData.discounts.map((discount, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        placeholder="Description (e.g., 6+ people)"
                        value={discount.description}
                        onChange={(e) => updateDiscount(index, 'description', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Percentage"
                        value={discount.percentage}
                        onChange={(e) => updateDiscount(index, 'percentage', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Min People"
                        value={discount.minPeople}
                        onChange={(e) => updateDiscount(index, 'minPeople', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeDiscount(index)}
                        className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Group Tour Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Tour Information
                  </label>
                  <textarea
                    name="groupTourInfo"
                    placeholder="Special information for group tours..."
                    value={formData.groupTourInfo}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Booking Status */}
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.bookingEnabled}
                      onChange={(e) => setFormData({ ...formData, bookingEnabled: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Enable Booking</span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingHotel(null);
                    }}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Hotel
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

export default AdminHotelManager; 