import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => ({
        url: "/Auth/Login",
        method: "POST",
        body,
      }),
    }),
  }),
});
export const { useLoginMutation } = authApi;
