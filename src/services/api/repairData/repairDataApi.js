import { baseApi } from "../baseApi";

const repairDataApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRepairData: build.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        // tasks
        const tasks = await fetchWithBQ("/Task/GetAll");
        if (tasks.error) return { error: tasks.error };

        // repair reason
        const repairReasons = await fetchWithBQ("/RepairReason/GetAll");
        if (repairReasons.error) return { error: repairReasons.error };

        // reapir type
        const repairTypes = await fetchWithBQ("/RepairType/GetAll");
        if (repairTypes.error) return { error: repairTypes.error };

        const result = {
          data: { tasks: tasks.data, repairReasons: repairReasons.data, repairTypes: repairTypes.data },
        };
        return result;
      },
    }),
  }),
});

export const { useGetRepairDataQuery } = repairDataApi;
