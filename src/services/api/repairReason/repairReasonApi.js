import { baseApi } from "../baseApi";

const repairReasonApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRepairReason: build.query({
      query: () => `/RepairReason/GetAll`,
      providesTags: (result, error, id) => [{ type: "RepairReasons", id: "List" }],
    }),
    addRepairReason: build.mutation({
      query: (body) => ({
        url: "/RepairReason",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "RepairReasons", id: "List" }],
    }),
    updateRepairReason: build.mutation({
      query: (body) => ({
        url: "/RepairReason",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "RepairReasons", id: "List" }],
    }),
    deleteRepairReason: build.mutation({
      query: (body) => ({
        url: `/RepairReason`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "RepairReasons", id: "List" }],
    }),
  }),
});

export const { useGetAllRepairReasonQuery, useAddRepairReasonMutation, useUpdateRepairReasonMutation, useDeleteRepairReasonMutation } =
  repairReasonApi;
