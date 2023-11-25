import { baseApi } from "../baseApi";

const customerProductApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addCustomerProduct: build.mutation({
      query: (body) => ({
        url: "/CustomerProduct",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "CustomerProduct", id: "List" }],
    }),
    getCustomerProductsByCustomerId: build.query({
      query: (id) => `/CustomerProduct/Customer/${id}`,
      providesTags: (result, error, id) => [{ type: "CustomerProduct", id: "List" }],
    })
  }),
});

export const { useAddCustomerProductMutation, useGetCustomerProductsByCustomerIdQuery } = customerProductApi;
