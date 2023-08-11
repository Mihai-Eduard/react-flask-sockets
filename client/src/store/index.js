import { configureStore } from "@reduxjs/toolkit";
import userDetailsSlice from "./user-details-slice";
import sessionSlice from "./session-slice";

const store = configureStore({
  reducer: {
    userDetails: userDetailsSlice.reducer,
    session: sessionSlice.reducer,
  },
});

export default store;
