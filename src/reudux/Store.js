import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reudux/userSlice"; 

export const Store = configureStore({
  reducer: {
    Users: userReducer, 
  },
});
