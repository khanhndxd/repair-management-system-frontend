import { baseApi } from "../baseApi"

const warrantyPolicyTaskApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWarrantyPolicyTasksByPolicyId: build.query({
      query: (id) => `/WarrantyPolicyTask/WarrantyPolicy/${id}`,
    }),
  }),
})

export const { useGetWarrantyPolicyTasksByPolicyIdQuery } = warrantyPolicyTaskApi