import { baseApi } from "../baseApi";

const repairOrderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRepairOrders: build.query({
      query: () => "/RepairOrder/GetAll",
      providesTags: (result, error, id) => [{ type: "RepairOrders", id: "List" }],
    }),
    getAllRepairOrdersWithQueryString: build.query({
      query: (query) =>
        `/RepairOrder/GetAll?field=${query.field}&time=${query.time ? query.time : ""}&startDate=${
          query.startDate ? query.startDate : ""
        }&endDate=${query.endDate ? query.endDate : ""}`,
      providesTags: (result, error, id) => [{ type: "RepairOrders", id: "List" }],
    }),
    getRepairOrderById: build.query({
      query: (id) => `/RepairOrder/${id}`,
      providesTags: (result, error, id) => [{ type: "RepairOrders", id }],
    }),
    getRepairOrderByStatus: build.query({
      query: (id) => `/RepairOrder/Status/${id}`,
      providesTags: (result, error, id) => [
        { type: "RepairOrders", id },
        { type: "RepairOrders", id: "List" },
      ],
    }),
    getTotalPrice: build.query({
      query: () => `/RepairOrder/TotalPrice`,
      providesTags: (result, error, id) => [{ type: "RepairOrders", id }],
    }),
    getRepairCategoryStats: build.query({
      query: () => "/RepairOrder/Category",
      providesTags: (result, error, id) => [{ type: "RepairOrders", id: "List" }],
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
      invalidatesTags: (result, error, { id }) => [
        { type: "RepairOrders", id },
        { type: "RepairOrders", id: "List" },
      ],
    }),
    updateRepairOrder: build.mutation({
      query: (body) => ({
        url: "/RepairOrder",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "RepairOrders", id },
        { type: "RepairOrders", id: "List" },
      ],
    }),
    updateTotalPrice: build.mutation({
      query: (body) => ({
        url: "/RepairOrder/TotalPrice",
        method: "PATCH",
        body,
      }),
    }),
    deleteRepairOrder: build.mutation({
      query: (body) => ({
        url: "/RepairOrder",
        method: "DELETE",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "RepairOrders", id },
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
  useGetRepairCategoryStatsQuery,
  useAddRepairOrderMutation,
  useUpdateRepairOrderStatusMutation,
  useUpdateRepairOrderMutation,
  useUpdateTotalPriceMutation,
  useDeleteRepairOrderMutation,
} = repairOrderApi;
