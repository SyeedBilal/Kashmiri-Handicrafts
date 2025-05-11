 import { createSlice } from '@reduxjs/toolkit';
const adminItemsSlice = createSlice({
  name: 'adminItems',
  initialState: [],
  reducers: {
    addAdminItem: (state, action) => {
      action.payload.forEach((newItem) => {
        const exists = state.some((item) => item._id === newItem._id);
        if (!exists) {
          state.push(newItem);
        }
      });
    },
    removeAdminItem: (state, action) => {

      // localStorage.removeItem('adminItems');
      return state.filter(item => item._id !== action.payload);
    }
  }
});
export const adminItemsActions = adminItemsSlice.actions;
export default adminItemsSlice.reducer;