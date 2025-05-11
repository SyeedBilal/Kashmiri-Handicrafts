import axios from 'axios';
import { store } from '../store/store'; 
import { logoutAdmin } from "../store/Slices/adminSlice"; 
import { logout } from '../store/Slices/authSlice'; 

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api` || 'http://localhost:3000/api',
  withCredentials: true, // Send cookies (session-based authentication)
});

// Update the axios instance to handle JWT for admins and session-based auth for users
api.interceptors.request.use((config) => {
  const path = window.location.pathname;

  if (path.startsWith('/admin')) {
    // Attach JWT token for admin requests
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }

  // For user requests, cookies are automatically sent due to `withCredentials: true`
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for unauthorized status or session expired messages
    if (
      error.response?.status === 401 || 
      error.response?.status === 403 ||
      error.response?.data?.isSessionExpired
    ) {
      const path = window.location.pathname;
      
      if (path.startsWith('/admin')) {
        // Handle admin logout
        store.dispatch(logoutAdmin());
        // Only purge persisted state during explicit logout
        if (error.response?.data?.isSessionExpired) {
          persistor.purge();
        }
        window.location.href = '/admin/login';
      } else {
        // Handle user logout
        store.dispatch(logout());
        localStorage.removeItem('user');
        // Only purge persisted state during explicit logout
        if (error.response?.data?.isSessionExpired) {
          persistor.purge();
        }
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { api }; // used this api instance in your API calls
