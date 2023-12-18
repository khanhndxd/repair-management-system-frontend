import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connection: null,
  connectionState: "disconnected",
};

const signalRSlice = createSlice({
  name: "signalR",
  initialState: initialState,
  reducers: {
    setConnection: (state, action) => {
      state.connection = action.payload;
    },
    setConnectionState: (state, action) => {
      state.connectionState = action.payload;
    },
  },
});

export const { setConnection, setConnectionState } = signalRSlice.actions;
export default signalRSlice.reducer;
