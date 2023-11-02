import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customer: null,
  repairReason: null,
  repairType: null,
  tasksProducts: [],
  anyProduct: false,
  total: 0,
  isWarranted: false,
};

export const repairOrderSlice = createSlice({
  name: "repair-order",
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      state.customer = action.payload;
    },
    addRepairInfo: (state, action) => {},
    addRepairType: (state, action) => {
      state.isWarranted = action.payload.object.id === 1;
    },
    addProduct: (state, action) => {
      state.tasksProducts.push({
        id: action.payload.object.productSerial,
        name: action.payload.object.productName,
      });
      state.anyProduct = true;
    },
    addTask: (state, action) => {
      state.tasksProducts.push({
        id: action.payload.object.id,
        name: action.payload.object.name,
      });
      state.total = action.payload.object.price;
    },
    removeTasksProducts: (state, action) => {
      state.tasksProducts = state.tasksProducts.filter((item) => {
        return item.id !== action.payload.id;
      });
      if (action.payload.isProduct === true) {
        state.anyProduct = false;
      }
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  addCustomer,
  addRepairInfo,
  addRepairType,
  addProduct,
  addTask,
  removeTasksProducts,
  reset,
} = repairOrderSlice.actions;
export default repairOrderSlice.reducer;