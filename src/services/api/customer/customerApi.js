import { baseApi } from "../baseApi";

const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCustomers: build.query({
      query: () => "/Customer/GetAll",
      providesTags: (result, error, id) => [{ type: "Customers", id: "List" }],
    }),
    getCustomerById: build.query({
      query: (id) => `/Customer/${id}`,
      providesTags: (result, error, id) => [{ type: "Customers", id: "Single" }],
    }),
    addCustomer: build.mutation({
      query: (body) => ({
        url: `/Customer`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Customers", id: "List" }],
    }),
    updateCustomer: build.mutation({
      query: (body) => ({
        url: "/Customer",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "Customers", id: "List" },
        { type: "Customers", id: "Single" },
      ],
    }),
  }),
});

export const {
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
} = customerApi;
