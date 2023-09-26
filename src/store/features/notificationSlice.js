import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "success",
  time: 4200,
  show: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.time = action.payload.time ? action.payload.time : state.time;
      state.show = true;
    },
    hideNotification: (state) => {
      state.show = false;
      state.time = 4200;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
});
export const { reset, showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
