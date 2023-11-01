import { baseApi } from "../baseApi"

const repairOrderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRepairOrders: build.query({
      query: () => '/RepairOrder/GetAll',
    }),
    getRepairOrderByCustomerId: build.query({
      query: (id) => `/RepairOrder/Customer/${id}`,
    }),
  }),
})

export const { useGetAllRepairOrdersQuery, useGetRepairOrderByCustomerIdQuery } = repairOrderApi