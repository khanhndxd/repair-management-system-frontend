import { baseApi } from "../baseApi"

const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCustomers: build.query({
      query: () => '/Customer/GetAll',
      providesTags: (result, error, id) => [{ type: 'Customers', id: "List" }],
    }),
    addCustomer: build.mutation({
      query: (body) => ({
        url: `/Customer`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Customers', id: 'List' }],
    })
  }),
})

export const { useGetAllCustomersQuery, useAddCustomerMutation } = customerApi