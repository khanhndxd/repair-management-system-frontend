"use client";

import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./features/notificationSlice";
import customerReducer from "./features/customerSlice";
import dialogReducer from "./features/dialogSlice";
import { baseApi } from "@/services/api/baseApi";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    dialog: dialogReducer,
    customer: customerReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});
