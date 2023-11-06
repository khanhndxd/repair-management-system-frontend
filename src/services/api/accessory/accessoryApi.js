import { baseApi } from "../baseApi";

const accessoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllAccessory: build.query({
      query: () => "/Accessory/GetAll",
    }),
  }),
});

export const { useGetAllAccessoryQuery } = accessoryApi;
