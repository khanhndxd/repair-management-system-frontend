import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: "Đang tải...",
  show: false,
};

export const loadingAsyncSlice = createSlice({
  name: "loading-async",
  initialState,
  reducers: {
    showLoading: (state, action) => {
      state.content = action.payload.content;
      state.show = true;
    },
    hideLoading: (state) => {
      state.content = "";
      state.show = false;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { showLoading, hideLoading, reset } = loadingAsyncSlice.actions;
export default loadingAsyncSlice.reducer;
