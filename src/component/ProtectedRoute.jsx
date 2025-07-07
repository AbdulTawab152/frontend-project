import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check if user is logged in and is admin
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // If no token or user is not admin, redirect to login
  if (!token || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // If user is admin, render the protected component
  return children;
}

export default ProtectedRoute; 