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
    // First remove the item
    await api.post('/cart/remove', {
      userId,
      productId
    });
    
    // Then fetch the updated cart to ensure we have the correct array
    const response = await api.get('/cart-items');
    dispatch(cartSliceActions.setCart(response.data));
  } catch (error) {
    console.error('Remove from cart error:', error);
  }
};
