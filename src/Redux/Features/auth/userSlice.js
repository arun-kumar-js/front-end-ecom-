import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user", // Correct name without curly braces
  initialState: {
    user: null, // Initial state is an empty user
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null; // Clears the user state
    },
  },
});

// Export the actions to use in components
export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state) => state.user; // Selector to get the user state
// Export the reducer to add it to the store
export default userSlice.reducer;
