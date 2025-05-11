import { cartSliceActions } from '../Slices/cartSlice';
import { api } from '../../services/axiosInstance';

export const fetchCart = () => {
  return async (dispatch) => {
    try {
      const response = await api.get('/cart-items');
      
      // Update the cart in Redux store
      dispatch(cartSliceActions.setCart(response.data));
      return response.data;
    } catch (error) {
      console.error('Fetch cart error:', error);
      throw error;
    }
  };
};

export const addToCartAsync = (userId, productId, quantity = 1) => async (dispatch) => {
  try {
    const response = await api.post('/add-to-cart', {
      userId,
      productId,
      quantity: 1
    });
    
    dispatch(cartSliceActions.setCart(response.data));
  } catch (error) {
    console.error('Add to cart error:', error);
  }
};

export const removeFromCartAsync = (userId, productId) => async (dispatch) => {
  try {
    const response = await api.post('/cart/remove', {
      userId,
      productId
    });
    
    dispatch(cartSliceActions.setCart(response.data));
  } catch (error) {
    console.error('Remove from cart error:', error);
  }
};
