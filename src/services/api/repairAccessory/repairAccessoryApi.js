import { baseApi } from "../baseApi";

const repairAccessoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addRepairAccessory: build.mutation({
      query: (body) => ({
        url: "/RepairAccessory",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "RepairOrders", id },
        { type: "RepairOrders", id: "List" },
      ],
    }),
  }),
});

export const { useAddRepairAccessoryMutation } = repairAccessoryApi;
