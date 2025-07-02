import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './slices/userSlice';

// Create the store
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer
  }
});

// Export the store and types
export { store };
export const RootState = {
  auth: {
    isAuthenticated: false,
    token: null,
    user: null
  },
  user: {
    loading: false,
    error: null
  }
};

export const AppDispatch = Function;