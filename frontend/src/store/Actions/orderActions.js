// store/orderActions.js
import { api } from '../../services/axiosInstance';
import {
  setLoading,
  setError,
  setCurrentOrder,
  setOrders,
  clearCurrentOrder
} from '../Slices/orderSlice';
import { cartSliceActions } from '../Slices/cartSlice'; // Assuming you have a clearCart action


// Create order and initialize payment
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await api.post('/orders/create', orderData);
    
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
    const response = await api.post('/orders/verify-payment', paymentData);

    if(response.data.success){
      dispatch(cartSliceActions.clearCart());
      dispatch(clearCurrentOrder());
    }
    else{
      dispatch(setError('Payment verification failed'));
    }
    
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
    
    const response = await api.get(`/orders/user/${userId}`);
    
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
//     const response = await api.get(`${API_URL}/orders/admin/${adminId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
    
//     dispatch(setOrders(response.data));
//   } catch (error) {
//     dispatch(setError(error.response?.data?.message || 'Failed to fetch admin orders'));
//   }
// };


