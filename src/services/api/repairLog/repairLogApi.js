import { baseApi } from "../baseApi";

const repairLogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRepairLogByRepairOrderId: build.query({
      query: (id) => `/RepairLog/RepairOrder/${id}`,
      providesTags: (result, error, id) => [{ type: "RepairLogs", id }],
    }),
    addRepairLog: build.mutation({
      query: (body) => ({
        url: "/RepairLog",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "RepairLogs", id }],
    }),
  }),
});

export const { useGetRepairLogByRepairOrderIdQuery, useAddRepairLogMutation } = repairLogApi;
