// store/orderActions.js
import axios from 'axios';
import {
  setLoading,
  setError,
  setCurrentOrder,
  setOrders,
  clearCurrentOrder
} from '../Slices/orderSlice';
import { cartSliceActions } from '../Slices/cartSlice'; // Assuming you have a clearCart action

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

// Create order and initialize payment
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await axios.post(`${API_URL}/orders/create`, orderData, {
      withCredentials:true,
    });
    
    dispatch(setCurrentOrder(response.data));
    return response.data; // Return for the component to handle Razorpay
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to create order'));
    throw error;
  }
};

// Verify payment after Razorpay callback
export const verifyPayment = (paymentData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${API_URL}/orders/verify-payment`, paymentData, {
      withCredentials:true,
    });

    if(response.data.success){
      dispatch(cartSliceActions.clearCart());
      dispatch(clearCurrentOrder());

    }
    else{
      dispatch(setError('Payment verification failed'));
    }
    // Clear cart after successful payment
    
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to verify payment'));
    throw error;
  }
};

// Fetch user orders
export const fetchUserOrders = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await axios.get(`${API_URL}/orders/user/${userId}`, {
      withCredentials:true,
    });
    
    dispatch(setOrders(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch orders'));
  }
};

// Fetch admin orders   (Implemented in AdminDashboard) for better performance implement here 


// export const fetchAdminOrders = (adminId) => async (dispatch) => {
//   try {
//     dispatch(setLoading(true));
    
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_URL}/orders/admin/${adminId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
    
//     dispatch(setOrders(response.data));
//   } catch (error) {
//     dispatch(setError(error.response?.data?.message || 'Failed to fetch admin orders'));
//   }
// };


