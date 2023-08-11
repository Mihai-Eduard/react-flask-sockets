import { configureStore } from "@reduxjs/toolkit";
import userDetailsSlice from "./user-details-slice";
import roomSlice from "./room-slice";

const store = configureStore({
  reducer: {
    userDetails: userDetailsSlice.reducer,
    room: roomSlice.reducer,
  },
});

export default store;
