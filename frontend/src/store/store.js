import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { persistConfig } from '../services/persistantConfig'
import itemsReducer from "./Slices/itemsSlice";
import cartReducer from './Slices/cartSlice';
import authReducer from './Slices/authSlice';
import adminReducer from './Slices/adminSlice'; 
import adminItemsReducer from './Slices/adminItemsSlice';
import orderReducer from './Slices/orderSlice'; 

// Combine reducers
const rootReducer = combineReducers({
  items: itemsReducer,
  cart: cartReducer,
  auth: authReducer,
  admin: adminReducer, 
  adminItems: adminItemsReducer, 
  order: orderReducer 
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat((storeAPI) => (next) => (action) => {
      console.log('%cAction Dispatched:', 'color: cyan', action);
      const result = next(action);
      console.log('%cNew State:', 'color: green', storeAPI.getState());
      return result;
    }),
});


export const persistor = persistStore(store);