

import axios from 'axios';
import { store } from '../store/store'; 
import { logoutAdmin } from "../store/Slices/adminSlice"; 
import { logout } from '../store/Slices/authSlice'; 

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Base URL for your API
  withCredentials: true, // Send cookies (session-based authentication)
});

// Interceptor
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
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem('admin');
        window.location.href = '/admin/login';
      } else {
        // Handle user logout
        store.dispatch(logout());
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { api }; // used this api instance in your API calls
