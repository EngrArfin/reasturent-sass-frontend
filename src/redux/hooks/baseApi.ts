// src/redux/hooks/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_API_ENDPOINT;

if (!baseURL) {
  throw new Error("VITE_API_ENDPOINT is not defined in environment variables");
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include", // Changed from "omit" to "include"
  prepareHeaders: (headers) => {
    const token = Cookies.get("token");
    if (token) {
      const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      headers.set("Authorization", authHeader);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithErrorHandler: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions
) => {
  try {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/signup")
      ) {
        Cookies.remove("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    return {
      error: {
        status: "FETCH_ERROR",
        error: "Failed to fetch",
      },
    };
  }
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: [
    "User",
    "Business",
    "SupportTickets",
    "SubscriptionPlans",
    "Vouchers",
  ],
  endpoints: () => ({}),
});
