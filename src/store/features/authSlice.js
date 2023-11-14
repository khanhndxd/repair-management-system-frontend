import { createSlice } from "@reduxjs/toolkit";
import { serialize, parse } from "cookie";

// Kiểm tra có đang ở browser hay ko
const isBrowser = typeof document !== "undefined";

// lấy cookie
const cookies = isBrowser ? parse(document.cookie || "") : {};
const user = cookies.user || null;
const token = cookies.token || null;
const refreshToken = cookies.refreshToken || null;

const initialState = {
  user: user,
  token: token,
  refreshToken: refreshToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;

      setMultipleCookies([
        { name: "user", value: user },
        { name: "token", value: token },
        { name: "refreshToken", value: refreshToken },
      ]);

      
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
    },
    logOut: (state, action) => {
      
      setMultipleCookies([
        { name: "user", options: { maxAge: 0 } },
        { name: "token", options: { maxAge: 0 } },
        { name: "refreshToken", options: { maxAge: 0 } },
      ]);

      
      state.user = null;
      state.token = null;
      state.refreshToken = null;

      
      if (isBrowser) {
        window.location.href = `/dang-nhap`;
      }
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;

const setMultipleCookies = (cookies) => {
  if (isBrowser) {
    // xóa cookie trước để tránh lặp
    cookies.forEach(({ name, value, options }) => {
      document.cookie = serialize(name, "", { maxAge: 0, path: "/", ...options });
    });

    // set các cookie mới
    cookies.forEach(({ name, value, options }) => {
      document.cookie = serialize(name, value, { path: "/", ...options });
    });
  }
};
