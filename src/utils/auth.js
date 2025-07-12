import axios from "axios";

const API_BASE_URL = "https://project-backend-5sjw.onrender.com";

// Token management functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenTimestamp", Date.now().toString());
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenTimestamp");
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  const timestamp = localStorage.getItem("tokenTimestamp");

  // Check if token is expired (24 hours)
  if (token && timestamp) {
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (tokenAge > maxAge) {
      logout();
      return null;
    }
  }

  return token;
};

export const setUserData = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserData = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getUserData();
  return !!(token && user && user.role === "admin");
};

// Enhanced logout function
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenTimestamp");
  localStorage.removeItem("user");
  delete axios.defaults.headers.common["Authorization"];
  window.location.href = "/login";
};

// Simplified token validation
export const validateToken = async () => {
  const token = getAuthToken();
  const user = getUserData();

  if (!token || !user) {
    return { valid: false, user: null };
  }

  try {
    setAuthToken(token);
    const response = await axios.get(`${API_BASE_URL}/api/auth/validate`);

    if (response.data.valid && response.data.user.role === "admin") {
      setUserData(response.data.user);
      return { valid: true, user: response.data.user };
    } else {
      logout();
      return { valid: false, user: null };
    }
  } catch (error) {
    // Keep local state for network issues
    if (error.code === "ERR_NETWORK") {
      return { valid: true, user: user };
    }
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

// Simplified token refresh
export const refreshTokenIfNeeded = async () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/validate`);
    return response.data.valid;
  } catch (error) {
    return true; // Keep local state for network issues
  }
};
