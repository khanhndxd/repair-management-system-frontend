import { baseApi } from "../baseApi";

const repairOrderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRepairOrders: build.query({
      query: () => "/RepairOrder/GetAll",
    }),
    getRepairOrderByCustomerId: build.query({
      query: (id) => `/RepairOrder/Customer/${id}`,
    }),
    addRepairOrder: build.mutation({
      query: (body) => ({
        url: "/RepairOrder",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetAllRepairOrdersQuery, useGetRepairOrderByCustomerIdQuery, useAddRepairOrderMutation } = repairOrderApi;
