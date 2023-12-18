import { convertFromVND, convertToVND } from "@/services/helper/helper";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customer: null,
  repairReason: null,
  repairType: null,
  tasksProducts: [],
  tasks: [],
  products: [],
  anyProduct: false,
  total: convertToVND(0),
  isWarranted: false,
  isExchange: false,
  isOrderFromCustomerPage: false,
  newRepairProducts: [],
};

export const repairOrderSlice = createSlice({
  name: "repair-order",
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      state.customer = action.payload;
    },
    addRepairType: (state, action) => {
      state.isWarranted = action.payload.object.name.localeCompare("Bảo hành", "vi", { sensitivity: "base" }) === 0;
      state.isExchange = action.payload.object.name.localeCompare("Đổi mới", "vi", { sensitivity: "base" }) === 0;

      if (state.isWarranted === true) {
        state.total = convertToVND(0);
      }

      if (state.isWarranted === false) {
        state.total = state.tasks.reduce((acc, currentItem) => {
          return acc + currentItem.price;
        }, 0);
        state.total = convertToVND(state.total);
      }

      if (state.isExchange === true) {
        state.total = state.tasks.reduce((acc, currentItem) => {
          return acc + currentItem.price;
        }, 0);
        const productOriginalPrice = state.products.reduce((acc, currentItem) => {
          if (currentItem.isWarrantyExpired === true) {
            return acc + currentItem.originalPrice;
          }
        }, 0);
        if (productOriginalPrice) {
          state.total += productOriginalPrice;
        }
        state.total = convertToVND(state.total);
      }
    },
    addNewRepairProduct: (state, action) => {
      const isDuplicateId = state.newRepairProducts.some((product) => product.id == "SPM" + action.payload.object.id);
      if (!isDuplicateId) {
        state.newRepairProducts.push({
          id: "SPM" + action.payload.object.id,
          realId: action.payload.object.id,
          name: action.payload.object.name,
          note: action.payload.object.note,
          description: action.payload.object.description ? action.payload.object.description : "",
        });
        state.tasksProducts.push({
          id: "SPM" + action.payload.object.id,
          name: action.payload.object.name,
          note: action.payload.object.note,
          type: "new",
        });
      }
    },
    addProduct: (state, action) => {
      const isDuplicateId = state.products.some((product) => product.id == action.payload.object.id);
      if (!isDuplicateId) {
        state.products.push({
          id: action.payload.object.id,
          serial: action.payload.object.productSerial,
          name: action.payload.object.productName,
          originalPrice: action.payload.object.originalPrice,
          isWarrantyExpired: action.payload.object.isWarrantyExpired,
          category: action.payload.object.category,
          description: action.payload.object.description ? action.payload.object.description : "",
        });
        state.tasksProducts.push({
          id: action.payload.object.productSerial,
          name: action.payload.object.productName,
          type: "product",
        });
        state.anyProduct = true;
        let alpha = state.isWarranted === true ? 0 : 1;

        if (state.isExchange === true) {
          const productOriginalPrice = state.products.reduce((acc, currentItem) => {
            if (currentItem.isWarrantyExpired === true) {
              return acc + currentItem.originalPrice;
            }
          }, 0);
          if (productOriginalPrice) {
            state.total = convertFromVND(state.total) + productOriginalPrice;
            state.total = convertToVND(state.total * alpha);
          }
        }
      }
    },
    addTask: (state, action) => {
      const isDuplicateId = state.tasks.some((task) => task.id === action.payload.object.id);
      if (!isDuplicateId) {
        state.tasks.push({
          id: action.payload.object.id,
          name: action.payload.object.name,
          price: action.payload.object.price,
          description: action.payload.object.description ? action.payload.object.description : "",
        });
        state.tasksProducts.push({
          id: action.payload.object.id,
          name: action.payload.object.name,
          price: action.payload.object.price,
          type: "task",
        });
        let alpha = state.isWarranted === true ? 0 : 1;

        state.total = state.tasks.reduce((acc, currentItem) => {
          return acc + currentItem.price;
        }, 0);

        if (state.isExchange === true) {
          const productOriginalPrice = state.products.reduce((acc, currentItem) => {
            if (currentItem.isWarrantyExpired === true) {
              return acc + currentItem.originalPrice;
            }
          }, 0);
          if (productOriginalPrice) {
            state.total += productOriginalPrice;
          }
        }

        state.total = convertToVND(state.total * alpha);
      }
    },
    updateTaskDescription: (state, action) => {
      let index = state.tasks.findIndex((x) => x.id === action.payload.object.id);
      if (index !== -1) {
        state.tasks[index].description = action.payload.object.description;
      }
    },
    updateProductDescription: (state, action) => {
      let index = state.products.findIndex((x) => x.serial == action.payload.object.id);
      if (index !== -1) {
        state.products[index].description = action.payload.object.description;
      }
    },
    updateNewProductDescription: (state, action) => {
      let index = state.newRepairProducts.findIndex((x) => x.id == action.payload.object.id);
      if (index !== -1) {
        state.newRepairProducts[index].description = action.payload.object.description;
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter((item) => {
        return item.id !== action.payload.id;
      });
      state.tasksProducts = state.tasksProducts.filter((item) => {
        return item.id !== action.payload.id;
      });
      let alpha = state.isWarranted === true ? 0 : 1;

      state.total = state.tasks.reduce((acc, currentItem) => {
        return acc + currentItem.price;
      }, 0);

      if (state.isExchange === true) {
        const productOriginalPrice = state.products.reduce((acc, currentItem) => {
          if (currentItem.isWarrantyExpired === true) {
            return acc + currentItem.originalPrice;
          }
        }, 0);

        if (productOriginalPrice) {
          state.total += productOriginalPrice;
        }
      }

      state.total = convertToVND(state.total * alpha);
    },
    removeTasksProducts: (state, action) => {
      state.tasksProducts = state.tasksProducts.filter((item) => {
        return item.id != action.payload.id;
      });
      state.tasks = state.tasks.filter((item) => {
        return item.id !== action.payload.id;
      });
      state.products = state.products.filter((item) => {
        return item.serial != action.payload.id;
      });
      state.newRepairProducts = state.newRepairProducts.filter((item) => {
        return item.id != action.payload.id;
      });
      if (action.payload.isProduct === true) {
        state.anyProduct = false;
      }
      let alpha = state.isWarranted === true ? 0 : 1;

      state.total = state.tasks.reduce((acc, currentItem) => {
        return acc + currentItem.price;
      }, 0);

      if (state.isExchange === true) {
        const productOriginalPrice = state.products.reduce((acc, currentItem) => {
          if (currentItem.isWarrantyExpired === true) {
            return acc + currentItem.originalPrice;
          }
        }, 0);
        if (productOriginalPrice) {
          state.total += productOriginalPrice;
        }
      }
      state.total = convertToVND(state.total * alpha);
    },
    isOrderFromCustomerPage: (state, action) => {
      state.isOrderFromCustomerPage = action.payload.flag;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  addCustomer,
  addRepairType,
  addNewRepairProduct,
  addProduct,
  addTask,
  updateTaskDescription,
  updateProductDescription,
  updateNewProductDescription,
  removeTask,
  removeTasksProducts,
  isOrderFromCustomerPage,
  reset,
} = repairOrderSlice.actions;
export default repairOrderSlice.reducer;
