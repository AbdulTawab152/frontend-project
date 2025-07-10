import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { validateToken } from '../utils/auth';

function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 ProtectedRoute: Starting authentication check...');
        const { valid, user } = await validateToken();
        console.log('🔍 ProtectedRoute: Validation result:', { valid, user: user ? user.username : 'null' });
        
        setIsAuthenticated(valid);
        
        if (!valid) {
          console.log('❌ ProtectedRoute: Authentication failed, redirecting to login');
          setError('Session expired. Please log in again.');
        } else {
          console.log('✅ ProtectedRoute: Authentication successful, showing dashboard');
        }
      } catch (err) {
        console.error('❌ ProtectedRoute: Authentication error:', err);
        setIsAuthenticated(false);
        setError('Authentication failed. Please log in again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show placeholder while validating token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Placeholder */}
          <div className="bg-white rounded-3xl shadow-sm p-8 mb-8 border border-gray-100 animate-pulse">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-4"></div>
              <div className="w-96 h-6 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>

          {/* Stats Cards Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Content Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="w-32 h-6 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-gray-200 p-4 rounded-2xl">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                      <div className="ml-3 w-32 h-6 bg-gray-300 rounded"></div>
                    </div>
                    <div className="w-48 h-4 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between mb-6">
                <div className="w-32 h-6 bg-gray-200 rounded"></div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error message if authentication failed
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-red-600 px-8 py-12 text-center">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white bg-opacity-20 backdrop-blur-sm mb-6">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Authentication Error</h2>
              <p className="text-red-100">{error}</p>
            </div>
            <div className="px-8 py-8 text-center">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
}

export default ProtectedRoute; 