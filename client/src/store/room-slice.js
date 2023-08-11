import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    roomID: null,
  },
  reducers: {
    setRoomID(state, action) {
      state.roomID = action.payload.roomID;
    },
  },
});

export default sessionSlice;
export const sessionActions = sessionSlice.actions;
