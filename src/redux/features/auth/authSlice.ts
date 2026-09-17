// src/redux/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { authApi } from "./authApi";
import { LoginResponse, SignupResponse, User, UserRole } from "./auth.type";

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
    // Handle Login
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }: PayloadAction<LoginResponse>) => {
        const token = payload.access_token || payload.accessToken || "";
        const userData = payload.user;
        state.token = token;
        state.user = {
          id: userData.id || (userData as any).sub || "",
          email: userData.email || "",
          name: userData.name || userData.email?.split("@")[0] || "User",
          role: userData.role || UserRole.super_admin,
          businessId: userData.businessId || null,
          tenantId: userData.businessId || (userData as any).tenantId || null,
          status: userData.status || "ACTIVE",
          avatar: userData.avatar || null,
          isActive: userData.isActive ?? true,
          isApproved: userData.isApproved ?? true,
          hasPin: userData.hasPin ?? false,
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt,
          business: userData.business,
        };
        if (token) {
          Cookies.set("token", token, {
            expires: 1,
            secure: true,
            sameSite: "strict",
          });
        }
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
          role: UserRole.super_admin,
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

    // Pin login matcher
    builder.addMatcher(
      authApi.endpoints.pinLogin.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.accessToken;

        state.user = {
          id: payload.user.sub,
          email: "",
          name: payload.user.name,
          role: payload.user.role || UserRole.server,
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
