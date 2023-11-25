import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  content:null,
  show: false,
  info: null
};

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    showDialog: (state, action) => {
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.info = action.payload.info ? action.payload.info : state.info
      state.show = true;
    },
    hideDialog: (state) => {
      state.title = "";
      state.content = null;
      state.show = false;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
});
export const { reset, showDialog, hideDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
