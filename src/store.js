import { configureStore } from "@reduxjs/toolkit";
import xmlReducer from "./slices/xmlSlice";

export const store = configureStore({
  reducer: {
    xml: xmlReducer,
  },
});