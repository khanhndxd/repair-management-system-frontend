import { baseApi } from "../baseApi";

const repairCustomerProductApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addRepairCustomerProduct: build.mutation({
      query: (body) => ({
        url: "/RepairCustomerProduct",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "RepairOrders", id: "Single" }],
    }),
  }),
});

export const { useAddRepairCustomerProductMutation } = repairCustomerProductApi;
