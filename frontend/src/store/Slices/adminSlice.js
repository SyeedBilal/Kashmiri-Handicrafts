// src/features/admin/adminSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Initial state for admin
const initialState = {
  admin: null,            // Will store { name, email, _id, role }
  isAuthenticated: false
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
    },
    logoutAdmin: (state) => {
      localStorage.removeItem('admin');
      state.admin = null;
      state.isAuthenticated = false;
    },
  },
});

// Actions
export const { setAdmin, logoutAdmin } = adminSlice.actions;

// Selectors
export const selectAdmin = (state) => state.admin.admin;
export const selectIsAdminAuthenticated = (state) => state.admin.isAuthenticated;

// Reducer
export default adminSlice.reducer;
