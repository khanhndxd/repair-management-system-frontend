import { createSlice } from "@reduxjs/toolkit";
import { serialize, parse } from "cookie";
import jwt from "jsonwebtoken";
// Kiểm tra có đang ở browser hay ko
const isBrowser = typeof document !== "undefined";

// lấy cookie
const cookies = isBrowser ? parse(document.cookie || "") : {};
const userId = cookies.userId || null;
const user = cookies.user || null;
const role = cookies.role || null;
const token = cookies.token || null;
const refreshToken = cookies.refreshToken || null;

const initialState = {
  userId: userId,
  user: user,
  role: role,
  token: token,
  refreshToken: refreshToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, refreshToken } = action.payload;
      try {
        // Giải mã token để lấy thông tin user
        const decodedToken = jwt.decode(token);
        // Lưu user và token vào state
        state.user = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        state.role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        state.userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        state.token = token;
        state.refreshToken = refreshToken;

        // Lưu vào cookie
        setMultipleCookies([
          { name: "userId", value: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] },
          { name: "user", value: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] },
          {
            name: "role",
            value: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
          },
          { name: "token", value: token },
          { name: "refreshToken", value: refreshToken },
        ]);
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        setMultipleCookies([
          { name: "userId", value: "User" },
          { name: "user", value: "User" },
          { name: "user", value: "User" },
          { name: "token", value: token },
          { name: "refreshToken", value: refreshToken },
        ]);
      }
    },
    logOut: (state, action) => {
      setMultipleCookies([
        { name: "userId", options: { maxAge: 0 } },
        { name: "user", options: { maxAge: 0 } },
        { name: "role", options: { maxAge: 0 } },
        { name: "token", options: { maxAge: 0 } },
        { name: "refreshToken", options: { maxAge: 0 } },
      ]);

      state.userId = null;
      state.user = null;
      state.role = null;
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
