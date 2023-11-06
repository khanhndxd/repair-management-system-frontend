import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessories: [],
};

export const accessoryCartSlice = createSlice({
  name: "accessory-cart",
  initialState,
  reducers: {
    addAccessory: (state, action) => {
      state.accessories.push({ ...action.payload.info, quantity: action.payload.quantity });
    },
    removeAccessory: (state, action) => {
      state.accessories = state.accessories.filter((item) => {
        return item.id !== action.payload.id;
      });
    },
    addChosenAccessory: (state, action) => {
      for (let i = 0; i < action.payload.info.length; i++) {
        let check = state.accessories.some((item) => item.id === action.payload.info[i].accessory.id);
        if (check === true) {
          state.accessories = state.accessories.filter((item) => {
            return item.id !== action.payload.info[i].accessory.id;
          });
        }
        state.accessories.push({
          ...action.payload.info[i].accessory,
          quantity: action.payload.info[i].quantity,
        });
      }
    },
    addQuantity: (state, action) => {
      for (let i = 0; i < state.accessories.length; i++) {
        if (state.accessories[i].id === action.payload.id) {
          state.accessories[i].quantity += 1;
        }
      }
    },
    removeQuantity: (state, action) => {
      for (let i = 0; i < state.accessories.length; i++) {
        if (state.accessories[i].id === action.payload.id) {
          state.accessories[i].quantity -= 1;
        }
      }
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
});
export const { addAccessory, removeAccessory, addChosenAccessory, addQuantity, removeQuantity, reset } =
  accessoryCartSlice.actions;

export default accessoryCartSlice.reducer;
