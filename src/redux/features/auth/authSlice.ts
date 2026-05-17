// src/redux/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { authApi } from "./authApi";
import { LoginResponse, SignupResponse, User } from "./auth.type";

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      Cookies.set("token", action.payload.token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      Cookies.remove("token");
      localStorage.removeItem("user");
    },
    loadUserFromStorage: (state) => {
      const token = Cookies.get("token");
      if (token) {
        state.token = token;
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            state.user = JSON.parse(userStr);
          } catch (error) {
            console.error("Failed to parse user from localStorage", error);
          }
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle Login - Updated for Swagger response
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }: PayloadAction<LoginResponse>) => {
        state.token = payload.accessToken;
        state.user = {
          id: payload.user.sub,
          email: payload.user.email,
          name: payload.user.email.split("@")[0],
          role: payload.user.role.toUpperCase(),
          tenantId: payload.user.tenantId,
        };
        Cookies.set("token", payload.accessToken, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
        localStorage.setItem("user", JSON.stringify(state.user));
        state.isLoading = false;
      },
    );

    // Handle Signup
    builder.addMatcher(
      authApi.endpoints.signup.matchFulfilled,
      (state, { payload }: PayloadAction<SignupResponse>) => {
        state.token = payload.accessToken;
        state.user = {
          id: payload.admin.id,
          email: payload.admin.email,
          name: payload.admin.name,
          role: "ADMIN",
          status: payload.admin.status,
          createdAt: payload.admin.createdAt,
        };
        Cookies.set("token", payload.accessToken, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
        localStorage.setItem("user", JSON.stringify(state.user));
        state.isLoading = false;
      },
    );

    // Handle loading states
    builder.addMatcher(
      (action) =>
        action.type.endsWith("/pending") &&
        (action.type.includes("login") || action.type.includes("signup")),
      (state) => {
        state.isLoading = true;
      },
    );

    builder.addMatcher(
      (action) =>
        action.type.endsWith("/rejected") &&
        (action.type.includes("login") || action.type.includes("signup")),
      (state) => {
        state.isLoading = false;
      },
    );

    /* login by pin */
    builder.addMatcher(
      authApi.endpoints.pinLogin.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.accessToken;

        state.user = {
          id: payload.user.sub,
          email: "", // no email in response
          name: payload.user.name,
          role: payload.user.role.toUpperCase(),
          tenantId: payload.user.tenantId,
        };

        Cookies.set("token", payload.accessToken, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });

        localStorage.setItem("user", JSON.stringify(state.user));
        state.isLoading = false;
      },
    );
  },
});

export const { setUser, logOut, loadUserFromStorage, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
