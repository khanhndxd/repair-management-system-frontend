import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name:"",
  phone: "",
  address: "",
  email: ""
};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.address = action.payload.address;
      state.email = action.payload.email;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
});
export const { reset, addCustomer } = customerSlice.actions;

export default customerSlice.reducer;
