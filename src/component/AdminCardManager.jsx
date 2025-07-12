import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:5001";

function AdminCardManager() {
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' or 'hotels'
  const [cards, setCards] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    province: '',
    price: '',
    duration: '',
    dates: '',
    rating: '',
    features: '',
    image: null,
    // Hotel specific fields
    name: '',
    city: '',
    address: '',
    amenities: '',
    roomTypes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cardsResponse, hotelsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/cards`),
        axios.get(`${API_BASE_URL}/api/hotels`)
      ]);
      setCards(cardsResponse.data);
      setHotels(hotelsResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleAddNew = () => {
    setFormData({
      title: '',
      description: '',
      province: '',
      price: '',
      duration: '',
      dates: '',
      rating: '',
      features: '',
      image: null,
      name: '',
      city: '',
      address: '',
      amenities: '',
      roomTypes: ''
    });
    setShowAddModal(true);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      province: item.province || '',
      price: item.price || '',
      duration: item.duration || '',
      dates: item.dates ? item.dates.join(', ') : '',
      rating: item.rating || '',
      features: item.features ? item.features.join(', ') : '',
      image: null,
      name: item.name || '',
      city: item.city || '',
      address: item.address || '',
      amenities: item.amenities ? item.amenities.join(', ') : '',
      roomTypes: item.roomTypes ? item.roomTypes.join(', ') : ''
    });
    setShowEditModal(true);
    setShowAddModal(false);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const endpoint = type === 'card' ? 'cards' : 'hotels';
      await axios.delete(`${API_BASE_URL}/api/${endpoint}/${id}`);
      setSuccess(`${type} deleted successfully`);
      fetchData();
    } catch (err) {
      setError(`Failed to delete ${type}`);
      console.error(`Error deleting ${type}:`, err);
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
        if (formData[key] !== null && formData[key] !== '') {
          if (key === 'features' || key === 'amenities' || key === 'roomTypes' || key === 'dates') {
            // Handle array fields
            const arrayValue = formData[key].split(',').map(item => item.trim());
            form.append(key, JSON.stringify(arrayValue));
          } else if (key === 'image' && formData[key] instanceof File) {
            // Handle image file
            form.append(key, formData[key]);
          } else if (key !== 'image') {
            // Handle regular string fields
            form.append(key, formData[key]);
          }
        }
      }

      if (showEditModal) {
        // Update existing item
        const endpoint = activeTab === 'cards' ? 'cards' : 'hotels';
        await axios.put(`${API_BASE_URL}/api/${endpoint}/${editingItem._id}`, form);
        setSuccess(`${activeTab === 'cards' ? 'Card' : 'Hotel'} updated successfully`);
      } else {
        // Create new item
        const endpoint = activeTab === 'cards' ? 'cards' : 'hotels';
        await axios.post(`${API_BASE_URL}/api/${endpoint}`, form);
        setSuccess(`${activeTab === 'cards' ? 'Card' : 'Hotel'} created successfully`);
      }

      setShowAddModal(false);
      setShowEditModal(false);
      setEditingItem(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${showEditModal ? 'update' : 'create'} ${activeTab === 'cards' ? 'card' : 'hotel'}`);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const currentData = activeTab === 'cards' ? cards : hotels;
  const itemType = activeTab === 'cards' ? 'card' : 'hotel';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
            <p className="text-gray-600">Manage all cards and hotels on the platform</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Add New {activeTab === 'cards' ? 'Card' : 'Hotel'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-4">
          <button
            onClick={() => handleTabChange('cards')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'cards'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Group Tour Cards ({cards.length})
          </button>
          <button
            onClick={() => handleTabChange('hotels')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'hotels'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hotel Cards ({hotels.length})
          </button>
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentData.map((item) => (
          <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Image */}
            <div className="h-48 relative">
              <img
                src={item.image
                  ? item.image.startsWith('/uploads/')
                    ? `${API_BASE_URL}${item.image}`
                    : item.image
                  : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"}
                alt={item.title || item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(item._id, itemType)}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title || item.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-blue-600">
                  ${item.price}
                </span>
                {item.rating && (
                  <div className="flex items-center">
                    {renderStars(item.rating)}
                    <span className="ml-1 text-sm text-gray-600">({item.rating})</span>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500">
                <p>{item.province || item.city}</p>
                {item.duration && <p>Duration: {item.duration}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {showEditModal ? 'Edit' : 'Add New'} {activeTab === 'cards' ? 'Card' : 'Hotel'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name={activeTab === 'cards' ? 'title' : 'name'}
                    placeholder={activeTab === 'cards' ? 'Title' : 'Hotel Name'}
                    value={formData[activeTab === 'cards' ? 'title' : 'name']}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name={activeTab === 'cards' ? 'province' : 'city'}
                    placeholder={activeTab === 'cards' ? 'Province' : 'City'}
                    value={formData[activeTab === 'cards' ? 'province' : 'city']}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
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

                {activeTab === 'cards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="duration"
                      placeholder="Duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="dates"
                      placeholder="Dates (comma separated)"
                      value={formData.dates}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {activeTab === 'hotels' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                )}

                <input
                  type="text"
                  name="features"
                  placeholder="Features (comma separated)"
                  value={formData.features}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
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
                    {showEditModal ? 'Update' : 'Create'}
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

export default AdminCardManager; 