import { baseApi } from "../baseApi";

const repairTaskApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addRepairTask: build.mutation({
      query: (body) => ({
        url: "/RepairTask",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "RepairOrders", id: "Single" },
        { type: "RepairOrders", id: "List" },
      ],
    }),
    updateRepairTaskDescription: build.mutation({
      query: (body) => ({
        url: "/RepairTask/Description",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const { useAddRepairTaskMutation, useUpdateRepairTaskDescriptionMutation } = repairTaskApi;
