import { logOut, setCredentials } from "@/store/features/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  console.log(result);

  if (result?.error?.status === 401) {
    console.log("sending refresh token");
    // send refresh token to get new access token
    const refreshResult = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/Auth/RefreshToken`, {
      method: "POST",
      body: JSON.stringify({
        accessToken: api.getState().auth.token,
        refreshToken: api.getState().auth.refreshToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const status = refreshResult.status;
    const data = await refreshResult.json();
    console.log(data)

    if (status === 400) {
      console.log("NOT VALID REFRESH TOKEN")
      api.dispatch(logOut());
    } 
    if(status === 200) {
      console.log("VALID REFRESH TOKEN")
      console.log(status)

      if (data) {
        console.log("DATA RESPONSE")
        console.log(data);
        const user = api.getState().auth.user;
        // store the new token
        api.dispatch(setCredentials({ ...data.data, user }));
        // retry the original query with new access token
        result = await baseQuery(args, api, extraOptions);
        console.log("COME BACK")
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Customers", "RepairOrders"],
  endpoints: () => ({}),
});
