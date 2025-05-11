// store/orderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
      state.loading = false;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  }
});

export const {
  setLoading,
  setError,
  setCurrentOrder,
  setOrders,
  clearCurrentOrder
} = orderSlice.actions;

export default orderSlice.reducer;