import { cartSliceActions } from '../Slices/cartSlice';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const fetchCart = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${API_URL}/api/cart-items`, {
        method:"GET",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();

      // Update the cart in Redux store
      dispatch(cartSliceActions.setCart(data));
      return data;
    } catch (error) {
      console.error('Fetch cart error:', error);
      throw error;
    }
  };
};

export const addToCartAsync = (userId, productId, quantity = 1) => async (dispatch) => {
  const res = await fetch(`${API_URL}/api/add-to-cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials:'include',
    body: JSON.stringify({ userId, productId, quantity:1 })
  });

  const cart = await res.json();
  dispatch(cartSliceActions.setCart(cart.items));
};

export const removeFromCartAsync = (userId, productId) => async (dispatch) => {
  const res = await fetch(`${API_URL}/api/cart/remove`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId }),
    credentials:'include'
  });

  const cart = await res.json();
  dispatch(cartSliceActions.setCart(cart.items));
};
