import { baseApi } from "../baseApi";

const repairProductApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addRepairProduct: build.mutation({
      query: (body) => ({
        url: "/RepairProduct",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "RepairOrders", id: "Single" },
        { type: "RepairOrders", id: "List" },
      ],
    }),
    updateRepairProduct: build.mutation({
      query: (body) => ({
        url: "/RepairProduct/Description",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const { useAddRepairProductMutation, useUpdateRepairProductMutation } = repairProductApi;
