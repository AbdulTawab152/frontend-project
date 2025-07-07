import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";
const BACKEND_URL = "http://localhost:5000";

function CardList() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  // Fetch cards
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cards');
      const data = await response.json();
      setCards(data);
    } catch (err) {
      console.error('Error fetching cards:', err);
    }
  };

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Tours</h1>
          <p className="text-xl text-gray-600 mb-8">Explore the best group tours and travel packages across Afghanistan</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map(card => (
          <div
            key={card._id}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          >
              {/* Image Section */}
              <div className="relative h-80 overflow-hidden">
              <img
                src={card.image
                  ? card.image.startsWith('/uploads/')
                    ? BACKEND_URL + card.image
                    : card.image
                  : DEFAULT_IMAGE}
                alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {card.province || 'Afghanistan'}
              </span>
                  {card.featured && (
                    <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Featured
                    </span>
                  )}
                </div>
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                    {renderStars(card.rating)}
                    <span className="ml-1 text-sm font-semibold text-gray-700">{card.rating}</span>
                  </div>
                </div>

                {/* Gallery Count */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {card.images?.length || 0} photos
                  </span>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold">
                    {card.duration}
                  </span>
                </div>
            </div>

            {/* Content Section */}
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {card.title}
                </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                  {card.description}
                </p>
                </div>

                {/* Features */}
                {card.features && card.features.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {card.features.slice(0, 4).map((feature, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium">
                          {feature}
                        </span>
                      ))}
                      {card.features.length > 4 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                          +{card.features.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tour Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center bg-gray-50 rounded-xl p-3">
                    <div className="text-lg font-bold text-blue-600">{card.duration}</div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-xl p-3">
                    <div className="text-lg font-bold text-green-600">{card.groupSize}</div>
                    <div className="text-xs text-gray-600">Group Size</div>
                  </div>
                </div>

                {/* Dates */}
                {card.dates && card.dates.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Available Dates
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {card.dates.slice(0, 3).map((date, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {date}
                        </span>
                      ))}
                      {card.dates.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          +{card.dates.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Price and Action Buttons */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-3xl font-bold text-green-600">
                  {card.price ? `$${card.price}` : 'Contact for price'}
                </span>
                      <span className="text-sm text-gray-500 ml-1">per person</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleTourDetail(card)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                <button 
                  onClick={() => handleBookNow(card)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                  Book Now
                </button>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>

        {/* Empty State */}
        {cards.length === 0 && (
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