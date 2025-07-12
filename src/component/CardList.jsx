import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";
const API_BASE_URL = "http://localhost:5001";

function CardList({ filterFn, headerTitle = 'Discover Amazing Tours', headerDesc = 'Explore the best group tours and travel packages across Afghanistan' }) {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  // Fetch cards
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cards`);
      const data = await response.json();
      setCards(data);
    } catch (err) {
      console.error('Error fetching cards:', err);
    }
  };

  const filteredCards = filterFn ? cards.filter(filterFn) : cards;

  // Handle booking navigation
  const handleBookNow = (card) => {
    navigate('/booking', { state: { tourData: card } });
  };

  // Handle tour detail view
  const handleTourDetail = (card) => {
    navigate(`/tour/${card._id}`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{headerTitle}</h1>
          <p className="text-xl text-gray-600 mb-8">{headerDesc}</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCards.map(card => (
          <div
            key={card._id}
            className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col"
          >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={card.image
                  ? card.image.startsWith('/uploads/')
                    ? API_BASE_URL + card.image
                    : card.image
                  : DEFAULT_IMAGE}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Province Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {card.province || 'Afghanistan'}
                </span>
                {card.featured && (
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Featured
                  </span>
                )}
              </div>
              {/* Price Badge */}
              <div className="absolute top-4 right-4">
                <span className="bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg text-blue-700 font-bold text-lg">
                  ${card.price}
                </span>
              </div>
            </div>
            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {card.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                    Duration: {card.duration}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                    Group Size: {card.groupSize}
                  </span>
                </div>
                {/* Province Details/Highlights */}
                {card.highlights && (
                  <div className="mb-2">
                    <span className="block text-xs text-gray-500 font-semibold mb-1">About {card.province}:</span>
                    <span className="text-gray-700 text-sm">{card.highlights}</span>
                  </div>
                )}
                <p className="text-gray-700 text-base leading-relaxed mb-3 line-clamp-3">
                  {card.description}
                </p>
                {/* Features */}
                {card.features && card.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {card.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                        {feature}
                      </span>
                    ))}
                    {card.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                        +{card.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              {/* Add back only the 'Book Now' button at the bottom of the card */}
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => handleBookNow(card)}
                  className="flex-1 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

        {/* Empty State */}
        {filteredCards.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tours available</h3>
            <p className="text-gray-500">Check back later for exciting tour packages</p>
          </div>
        )}
        </div>
    </div>
  );
}

export default CardList;