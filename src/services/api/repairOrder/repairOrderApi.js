import { baseApi } from "../baseApi";

const repairOrderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRepairOrders: build.query({
      query: () => "/RepairOrder/GetAll",
      providesTags: (result, error, id) => [{ type: "RepairOrders", id: "List" }],
    }),
    getAllRepairOrdersWithQueryString: build.query({
      query: (query) => `/RepairOrder/GetAll?field=${query.field}&time=${query.time ? query.time : ""}`,
      providesTags: (result, error, id) => [{ type: "RepairOrders", id: "List" }],
    }),
    getRepairOrderById: build.query({
      query: (id) => `/RepairOrder/${id}`,
      providesTags: (result, error, id) => [{ type: "RepairOrders", id: "Single" }],
    }),
    getRepairOrderByStatus: build.query({
      query: (id) => `/RepairOrder/Status/${id}`,
      providesTags: (result, error, id) => [{ type: "RepairOrders", id: "Single" }],
    }),
    getTotalPrice: build.query({
      query: () => `/RepairOrder/TotalPrice`,
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
    deleteRepairOrder: build.mutation({
      query: (body) => ({
        url: "/RepairOrder",
        method: "DELETE",
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
  useGetRepairOrderByStatusQuery,
  useGetAllRepairOrdersWithQueryStringQuery,
  useGetTotalPriceQuery,
  useAddRepairOrderMutation,
  useUpdateRepairOrderStatusMutation,
  useUpdateRepairOrderMutation,
  useDeleteRepairOrderMutation
} = repairOrderApi;
