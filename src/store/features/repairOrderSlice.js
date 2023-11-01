import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    customer: null,
    repairReason:null,
    repairType:null,
    task:null,
    total: 0,
    isWarranted: true,
    warrantyInfo: [],
};

export const repairOrderSlice = createSlice({
    name:"repair-order",
    initialState,
    reducers: {
        addCustomer: (state, action) => {

        },
        addRepairInfo: (state, action) => {

        },
        addProduct: (state, action) => {

        },
        addRepairType: (state, action) => {
            state.repairType = action.payload.repairType;
        },
        addTask: (state, action) => {
            state.task = action.payload.task;
        },
        setIsWarranted: (state, action) => {
            state.isWarranted = action.payload.isWarranted;
        },
        reset: (state) => {
            Object.assign(state, initialState);
        }
    }
})

export const {addCustomer, addRepairInfo, addProduct, setIsWarranted, addRepairType, addTask, reset} = repairOrderSlice.actions;
export default repairOrderSlice.reducer;