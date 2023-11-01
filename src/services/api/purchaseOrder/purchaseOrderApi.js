import { baseApi } from "../baseApi"

const purchaseOrderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPurchaseOrderByCustomerId: build.query({
      query: (id) => `/PurchaseOrder/Customer/${id}`,
    }),
  }),
})

export const { useGetPurchaseOrderByCustomerIdQuery } = purchaseOrderApi