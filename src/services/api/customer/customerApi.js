import { baseApi } from "../baseApi"

const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCustomers: build.query({
      query: () => '/Customer/GetAll',
    }),
  }),
})

export const { useGetAllCustomersQuery } = customerApi