import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "https://project-backend-5sjw.onrender.com";

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
      console.log('Fetching tour with id:', id);
      const response = await axios.get(`${API_BASE_URL}/api/cards/${id}`);
      setTour(response.data);
      console.log('Tour data:', response.data);
    } catch (err) {
      setError(`Failed to fetch tour details for id: ${id}`);
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
          <div className="text-xl text-gray-600 mb-4">Tour not found for id: {id}</div>
          <div className="text-sm text-red-500 mb-2">{error}</div>
          <button 
            onClick={() => navigate('/group-tours')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Group Tours
          </button>
        </div>
      </div>
    );
  }

  const images = tour.images && tour.images.length > 0 ? tour.images : [tour.image];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-12">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        {images[0] && (
          <img
            src={images[0].startsWith('/uploads/') ? `${API_BASE_URL}${images[0]}` : images[0]}
            alt={tour.name || tour.title}
            className="w-full h-80 object-cover rounded-xl mb-6"
          />
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{tour.name || tour.title}</h1>
        <p className="text-gray-700 text-lg leading-relaxed">{tour.description}</p>
      </div>
    </div>
  );
};

export default TourDetailPage; 