import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    setCart: (state, action) => action.payload,
    addItem: (state, action) => {
      const existing = state.find(item => item.productId._id === action.payload.productId._id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.push(action.payload);
      }
    },
    removeItem: (state, action) => {
      return state.filter(item => item.productId._id !== action.payload);
    },
    clearCart: () => []
  }
});

export const cartSliceActions = cartSlice.actions;
export default cartSlice.reducer;
