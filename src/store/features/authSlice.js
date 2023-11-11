import { createSlice } from "@reduxjs/toolkit";
import { serialize, parse } from "cookie";

// Check if we are in the browser before accessing document
const isBrowser = typeof document !== "undefined";

// Get user and token from cookies
const cookies = isBrowser ? parse(document.cookie || "") : {};
const user = cookies.user || null;
const token = cookies.token || null;

const initialState = {
  user: user,
  token: token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      // Set cookies on the client side
      if (isBrowser) {
        document.cookie = serialize("user", user);
        document.cookie = serialize("token", accessToken);
      }
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
      if (isBrowser) {
        document.cookie = serialize("user", "", { maxAge: -1 });
        document.cookie = serialize("token", "", { maxAge: -1 });
      }
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
