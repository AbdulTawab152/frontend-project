import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserData } from '../utils/auth';

const API_BASE_URL = "https://project-backend-5sjw.onrender.com";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalGroupBookings: 0,
    totalHotelBookings: 0,
    totalHotels: 0,
    totalCards: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data using auth utility
    const userData = getUserData();
    setUser(userData);

    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all bookings
      const bookingsResponse = await axios.get(`${API_BASE_URL}/api/bookings`);
      const allBookings = bookingsResponse.data;
      
      // Fetch hotels
      const hotelsResponse = await axios.get(`${API_BASE_URL}/api/hotels`);
      const hotels = hotelsResponse.data;
      
      // Fetch cards
      const cardsResponse = await axios.get(`${API_BASE_URL}/api/cards`);
      const cards = cardsResponse.data;

      // Calculate stats
      const groupBookings = allBookings.filter(booking => booking.bookingType === 'group');
      const hotelBookings = allBookings.filter(booking => booking.bookingType === 'hotel');
      
      // Get recent bookings (last 5)
      const recentBookings = allBookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalBookings: allBookings.length,
        totalGroupBookings: groupBookings.length,
        totalHotelBookings: hotelBookings.length,
        totalHotels: hotels.length,
        totalCards: cards.length,
        recentBookings
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // This function is no longer needed as logout is handled in AdminLayout
    // Keeping for potential future use
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      change: '+12%',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      path: '/admin/group-bookings'
    },
    {
      title: 'Group Bookings',
      value: stats.totalGroupBookings,
      change: '+8%',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      path: '/admin/group-bookings'
    },
    {
      title: 'Hotel Bookings',
      value: stats.totalHotelBookings,
      change: '+15%',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      path: '/admin/hotel-bookings'
    },
    {
      title: 'Total Hotels',
      value: stats.totalHotels,
      change: '+3%',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      path: '/admin/hotels'
    }
  ];

  const quickActions = [
    {
      title: 'View All Bookings',
      description: 'Manage group and hotel bookings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      path: '/admin/group-bookings',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Manage Cards',
      description: 'Update tour packages and cards',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      path: '/admin/cards',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];



  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome to Dashboard</h1>
            <p className="text-gray-600">Here's what's happening with your bookings today</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {loading ? (
          // Placeholder cards while loading
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 lg:p-3 rounded-xl bg-gray-200 w-12 h-12"></div>
                <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 group"
              onClick={() => navigate(stat.path)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 lg:p-3 rounded-xl bg-gradient-to-r ${stat.bgGradient} group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`text-white bg-gradient-to-r ${stat.gradient} p-2 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions and Recent Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            {loading ? (
              // Placeholder quick actions while loading
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 p-4 lg:p-6 rounded-2xl animate-pulse"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-300 rounded-xl"></div>
                    <div className="ml-3 lg:ml-4 w-32 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-48 h-4 bg-gray-300 rounded"></div>
                </div>
              ))
            ) : (
              quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`bg-gradient-to-r ${action.gradient} text-white p-4 lg:p-6 rounded-2xl text-left hover:shadow-lg hover:scale-105 transition-all duration-300 group w-full`}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {action.icon}
                    </div>
                    <h3 className="ml-3 lg:ml-4 text-base lg:text-lg font-semibold">{action.title}</h3>
                  </div>
                  <p className="text-sm opacity-90">{action.description}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Recent Bookings</h2>
            <button
              onClick={() => navigate('/admin/group-bookings')}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View All
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {loading ? (
            // Placeholder recent bookings while loading
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : stats.recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-sm lg:text-base text-gray-500 mb-4">Get started by creating your first booking.</p>
              <button
                onClick={() => navigate('/admin/group-bookings')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Booking
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentBookings.slice(0, 3).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {(booking.fullName || booking.customerName || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {booking.fullName || booking.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ${booking.totalPrice || booking.price}
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.bookingType === 'group' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.bookingType === 'group' ? 'Group' : 'Hotel'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 