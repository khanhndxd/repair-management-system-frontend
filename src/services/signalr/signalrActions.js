import { createAction } from "@reduxjs/toolkit";

// Tạo action creator
export const startSignalRConnection = createAction("signalR/startConnection");
export const stopSignalRConnection = createAction("signalR/stopConnection");

export const joinSignalRGroup = createAction("signalR/joinGroup");
export const leaveSignalRGroup = createAction("signalR/leaveGroup");
