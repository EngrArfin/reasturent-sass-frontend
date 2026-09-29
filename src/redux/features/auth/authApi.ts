// src/redux/features/auth/authApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  LoginRequest,
  LoginResponse,
  PinLoginRequest,
  PinLoginResponse,
  SignupRequest,
  SignupResponse,
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/redux/features/auth/auth.type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Updated to match Swagger endpoint: /api/auth/login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login", // Changed from /admin/login to /auth/login
        method: "POST",
        body: credentials, // Now sends { email, pin }
      }),
      invalidatesTags: ["User"],
    }),

    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (payload) => ({
        url: "/admin/signup",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

    /* Pin Login */
    pinLogin: builder.mutation<PinLoginResponse, PinLoginRequest>({
      query: (body) => ({
        url: "/auth/pin-login",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // GET /auth/profile - Get Logged-in User Profile & Account Details
    getProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // PATCH /auth/profile - Update User Profile / Identity Details
    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (body) => ({
        url: "/auth/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // PATCH /auth/change-password - Change User Password
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  usePinLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;

