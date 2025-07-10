import axios from 'axios';

const API_BASE_URL = "http://localhost:5000";

// Token management functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('✅ Token set successfully:', token.substring(0, 20) + '...');
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    console.log('🗑️ Token removed');
  }
};

export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('🔍 Getting token:', token ? 'exists' : 'not found');
  return token;
};

export const setUserData = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  console.log('✅ User data saved:', user.username);
};

export const getUserData = () => {
  const user = localStorage.getItem('user');
  const parsedUser = user ? JSON.parse(user) : null;
  console.log('🔍 Getting user data:', parsedUser ? parsedUser.username : 'not found');
  return parsedUser;
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getUserData();
  const authenticated = !!(token && user && user.role === 'admin');
  console.log('🔍 Is authenticated:', authenticated);
  return authenticated;
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
  console.log('🚪 Logged out, cleared all data');
  
  // Redirect to login page
  window.location.href = '/login';
};

// Token validation function
export const validateToken = async () => {
  const token = getAuthToken();
  const user = getUserData();

  console.log('🔍 Starting token validation...');
  console.log('🔍 Token exists:', !!token);
  console.log('🔍 User exists:', !!user);

  if (!token || !user) {
    console.log('❌ No token or user data found');
    return { valid: false, user: null };
  }

  try {
    console.log('🔍 Setting token in axios headers...');
    setAuthToken(token); // Set token in axios headers
    
    console.log('🔍 Calling backend validation endpoint...');
    const response = await axios.get(`${API_BASE_URL}/api/auth/validate`);
    console.log('🔍 Backend response:', response.data);
    
    if (response.data.valid && response.data.user.role === 'admin') {
      console.log('✅ Token is valid and user is admin');
      // Update user data with fresh data from server
      setUserData(response.data.user);
      return { valid: true, user: response.data.user };
    } else {
      console.log('❌ Token invalid or user not admin');
      // Clear invalid data
      logout();
      return { valid: false, user: null };
    }
  } catch (error) {
    console.error('❌ Token validation error:', error);
    console.error('❌ Error response:', error.response?.data);
    logout();
    return { valid: false, user: null };
  }
};

// Initialize auth state on app startup
export const initializeAuth = () => {
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
  }
}; 