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
    register: build.mutation({
      query: (body) => ({
        url: "/Auth/Register",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Users", id: "List" }],
    }),
  }),
});
export const { useLoginMutation, useRegisterMutation } = authApi;
