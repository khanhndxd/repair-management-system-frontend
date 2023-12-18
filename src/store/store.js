"use client";

import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./features/notificationSlice";
import customerReducer from "./features/customerSlice";
import dialogReducer from "./features/dialogSlice";
import loadingAsyncReducer from "./features/loadingAsyncSlice";
import repairOrderReducer from "./features/repairOrderSlice";
import accessoryCartReducer from "./features/accessoryCartSlice";
import authReducer from "./features/authSlice";
import { baseApi } from "@/services/api/baseApi";
import signalRReducer from "@/services/signalr/signalrSlice";
import signalRMiddleware from "@/services/signalr/signalrMiddleware";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    dialog: dialogReducer,
    customer: customerReducer,
    loadingAsync: loadingAsyncReducer,
    repairOrder: repairOrderReducer,
    accessoryCart: accessoryCartReducer,
    auth: authReducer,
    signalr: signalRReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["signalR/startConnection", "signalR/stopConnection"],
        ignoredActionPaths: ["payload", "meta.baseQueryMeta", "meta.arg"],
        ignoredPaths: ["signalr.connection", "api.queries.getAllRepairOrdersWithQueryString"],
      },
    }).concat(baseApi.middleware, signalRMiddleware),
});
