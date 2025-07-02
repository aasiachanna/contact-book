import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { setLoading, setError, clearError } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;
