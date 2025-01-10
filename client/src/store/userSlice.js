import { createSlice } from '@reduxjs/toolkit';

// Initial state for the user slice
const initialState = {
  userDetails: null, // Stores details of the authenticated user
};

// Define the user slice
const userSlice = createSlice({
  name: 'user', // Name of the slice
  initialState,
  reducers: {
    // Action to set user details
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    },
    // Action to clear user details (e.g., on logout)
    clearUserDetails(state) {
      state.userDetails = null;
    },
  },
});

// Export actions for use in components
export const { setUserDetails, clearUserDetails } = userSlice.actions;

// Export the reducer for store configuration
export default userSlice.reducer;
