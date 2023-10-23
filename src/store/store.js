"use client";

import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./features/notificationSlice";
import customerReducer from "./features/customerSlice";
import dialogReducer from "./features/dialogSlice";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    dialog: dialogReducer,
    customer: customerReducer,
  },
});
