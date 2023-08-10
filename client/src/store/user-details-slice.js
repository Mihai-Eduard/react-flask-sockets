import { createSlice } from "@reduxjs/toolkit";

const userDetailsSlice = createSlice({
  name: "current",
  initialState: {
    id: null,
    email: null,
    username: null,
  },
  reducers: {
    setID(state, action) {
      state.id = action.payload.id;
    },
    setEmail(state, action) {
      state.email = action.payload.email;
    },
    setUsername(state, action) {
      state.username = action.payload.username;
    },
  },
});

export default userDetailsSlice;
export const userDetailsActions = userDetailsSlice.actions;
