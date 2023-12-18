import { baseApi } from "../baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUser: build.query({
      query: () => "/User/GetAll",
      providesTags: (result, error, id) => [{ type: "Users", id: "List" }],
    }),
    getAllRoles: build.query({
      query: () => "/User/GetAllRoles",
    }),
    updateUser: build.mutation({
      query: (body) => ({
        url: "/User/Update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id: "List" },
        { type: "RepairOrders", id: "List" },
      ],
    }),
    changePassword: build.mutation({
      query: (body) => ({
        url: "/User/ChangePassword",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Users", id: "List" }],
    }),
    changeRole: build.mutation({
      query: (body) => ({
        url: "/User/ChangeRole",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Users", id: "List" }],
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `/User/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Users", id: "List" }],
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetAllRolesQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useChangeRoleMutation,
  useDeleteUserMutation,
} = userApi;
