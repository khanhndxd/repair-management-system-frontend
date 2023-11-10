import { baseApi } from "../baseApi";

const repairOrderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRepairOrders: build.query({
      query: () => "/RepairOrder/GetAll",
      providesTags: (result, error, id) => [{ type: "RepairOrders", id: "List" }],
    }),
    getRepairOrderById: build.query({
      query: (id) => `/RepairOrder/${id}`,
      providesTags: (result, error, id) => [{ type: "RepairOrders", id: "Single" }],
    }),
    addRepairOrder: build.mutation({
      query: (body) => ({
        url: "/RepairOrder",
        method: "POST",
        body,
      }),
    }),
    updateRepairOrderStatus: build.mutation({
      query: (body) => ({
        url: "/RepairOrder/Status",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "RepairOrders", id: "Single" },
        { type: "RepairOrders", id: "List" },
      ],
    }),
    updateRepairOrder: build.mutation({
      query: (body) => ({
        url: "/RepairOrder",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "RepairOrders", id: "Single" },
        { type: "RepairOrders", id: "List" },
      ],
    }),
  }),
});

export const {
  useGetAllRepairOrdersQuery,
  useGetRepairOrderByIdQuery,
  useAddRepairOrderMutation,
  useUpdateRepairOrderStatusMutation,
  useUpdateRepairOrderMutation,
} = repairOrderApi;
