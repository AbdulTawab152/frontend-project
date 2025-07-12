import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Hero from './component/Hero';
import Footer from './component/Footer';

const API_BASE_URL = "http://localhost:5001";

const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelsResponse, cardsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/hotels`),
        axios.get(`${API_BASE_URL}/api/cards`)
      ]);
      setHotels(hotelsResponse.data.slice(0, 3)); // Show only 3 hotels
      setCards(cardsResponse.data.slice(0, 3)); // Show only 3 cards
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
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

  const services = [
    {
      icon: "🏨",
      title: "Luxury Hotels",
      description: "Experience world-class accommodations in carefully selected hotels across Afghanistan. From modern amenities to traditional hospitality, we ensure your comfort and satisfaction.",
      features: ["5-Star Accommodations", "Modern Amenities", "Traditional Hospitality"]
    },
    {
      icon: "🚌",
      title: "Group Tours",
      description: "Join our expertly guided group tours for unforgettable adventures. Discover hidden gems, cultural treasures, and breathtaking landscapes with like-minded travelers.",
      features: ["Expert Guides", "Cultural Experiences", "Group Discounts"]
    },
    {
      icon: "🎫",
      title: "Easy Booking",
      description: "Simple and secure booking process with instant confirmation. Multiple payment options and flexible cancellation policies for your peace of mind.",
      features: ["Instant Confirmation", "Multiple Payment Options", "Flexible Cancellation"]
    },
    {
      icon: "👥",
      title: "Expert Guides",
      description: "Professional local guides with deep knowledge of Afghan culture, history, and traditions. Learn from the best and discover authentic experiences.",
      features: ["Local Expertise", "Cultural Knowledge", "Personalized Service"]
    },
    {
      icon: "🛡️",
      title: "Safe Travel",
      description: "Your safety is our absolute priority. Comprehensive travel insurance, 24/7 support, and thorough safety protocols ensure worry-free travel.",
      features: ["Travel Insurance", "Safety Protocols", "24/7 Support"]
    },
    {
      icon: "📱",
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you throughout your journey. From booking to return, we're here for you every step of the way.",
      features: ["24/7 Assistance", "Multi-language Support", "Emergency Contact"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "United States",
      text: "The group tour to Kabul was absolutely incredible! Our guide was so knowledgeable about Afghan history and culture. The hotels were luxurious and the service was exceptional. I felt completely safe throughout the entire journey.",
      rating: 5,
      avatar: "👩‍🦰"
    },
    {
      name: "Ahmed Hassan",
      location: "Dubai",
      text: "As a frequent traveler, I can say this was one of my best experiences. The attention to detail, professional guides, and beautiful accommodations made this trip unforgettable. Highly recommended!",
      rating: 5,
      avatar: "👨‍🦱"
    },
    {
      name: "Maria Rodriguez",
      location: "Spain",
      text: "I was initially hesitant about traveling to Afghanistan, but the team made everything so smooth and safe. The landscapes are breathtaking and the cultural experiences were authentic. The booking process was hassle-free.",
      rating: 5,
      avatar: "👩‍🦳"
    },
    {
      name: "David Chen",
      location: "Canada",
      text: "The hotel accommodations were top-notch and the group tour was perfectly organized. Our guide shared fascinating insights about local traditions. This trip exceeded all my expectations!",
      rating: 5,
      avatar: "👨‍🦲"
    },
    {
      name: "Fatima Al-Zahra",
      location: "Qatar",
      text: "Beautiful country with rich history. The service was impeccable and the guides were professional. I felt completely taken care of throughout my stay. Will definitely return!",
      rating: 5,
      avatar: "👩‍🦱"
    },
    {
      name: "James Wilson",
      location: "Australia",
      text: "An amazing adventure! The combination of luxury hotels and authentic cultural experiences was perfect. The team's attention to safety and comfort made this trip truly special.",
      rating: 5,
      avatar: "👨‍🦰"
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Travelers" },
    { number: "50+", label: "Destinations" },
    { number: "100+", label: "Hotels" },
    { number: "24/7", label: "Support" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      {/* Removed Our Services section as requested */}

      {/* Featured Hotels Section */}
      {hotels.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Hotels</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience luxury and comfort in our carefully selected hotels
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <div key={hotel._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 relative">
                    <img
                      src={hotel.image
                        ? hotel.image.startsWith('/uploads/')
                          ? `${API_BASE_URL}${hotel.image}`
                          : hotel.image
                        : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {hotel.city}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {renderStars(hotel.rating)}
                        <span className="ml-2 text-sm text-gray-600">({hotel.rating})</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">${hotel.price}</span>
                    </div>
                    
                    <button
                      onClick={() => navigate('/hotel-booking', { state: { hotelData: hotel } })}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/hotels')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                View All Hotels
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Tours Section */}
      {cards.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Tours</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the most exciting group tours and travel packages
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cards.map((card) => (
                <div key={card._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 relative">
                    <img
                      src={card.image
                        ? card.image.startsWith('/uploads/')
                          ? `${API_BASE_URL}${card.image}`
                          : card.image
                        : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {card.province}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{card.description}</p>
                    
                    {card.features && card.features.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {card.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {renderStars(card.rating)}
                        <span className="ml-2 text-sm text-gray-600">({card.rating})</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">${card.price}</span>
                    </div>
                    
                    <button
                      onClick={() => navigate('/booking', { state: { hotelData: card } })}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Book Tour
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/')}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                View All Tours
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Travelers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from our satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div className="flex items-center">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic text-sm leading-relaxed">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of travelers who have discovered the beauty of Afghanistan with our expert guides and premium services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/hotels')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Explore Hotels
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
            >
              View Tours
            </button>
          </div>
        </div>
      </section>
      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default HomePage;
