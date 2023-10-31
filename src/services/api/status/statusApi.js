import { baseApi } from "../baseApi"

const statusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStatuses: build.query({
      query: () => '/Status/GetAll',
    }),
  }),
})

export const { useGetAllStatusesQuery } = statusApi