import { baseApi } from "../baseApi";

const repairAccessoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addRepairAccessory: build.mutation({
      query: (body) => ({
        url: "/RepairAccessory",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "RepairOrders", id: "Single" },
        { type: "RepairOrders", id: "List" },
      ],
    }),
  }),
});

export const { useAddRepairAccessoryMutation } = repairAccessoryApi;
