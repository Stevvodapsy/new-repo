import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import appReducer from "./appSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    app: appReducer,
    auth: authReducer,
  },
});

export default store;
