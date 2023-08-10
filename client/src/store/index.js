import { configureStore } from "@reduxjs/toolkit";
import userDetailsSlice from "./user-details-slice";

const store = configureStore({
  reducer: { userDetails: userDetailsSlice.reducer },
});

export default store;
