import { createSlice } from "@reduxjs/toolkit";

const itemsSlice=createSlice({
  name:'items',
  initialState:[],
  reducers:{
    addItem: (state, action) => {
      action.payload.forEach((newItem) => {
        const exists = state.some((item) => item._id === newItem._id);
        if (!exists) {
          state.push(newItem);
        }
      });
    },
    
        removeItem:(state,action)=>{
          return state.filter(item=>item._id !==action.payload);
        }
          }
  }

)
export const itemsActions=itemsSlice.actions;
export default itemsSlice.reducer;