"use client";

import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./features/notificationSlice";
import customerReducer from "./features/customerSlice";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    customer: customerReducer,
  },
});
