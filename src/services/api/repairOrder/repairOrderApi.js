import { baseApi } from "../baseApi"

const repairOrderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRepairOrders: build.query({
      query: () => '/RepairOrder/GetAll',
    }),
  }),
})

export const { useGetAllRepairOrdersQuery } = repairOrderApi