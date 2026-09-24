// src/redux/features/cashier/cashierHubAndOrderMenuApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  ICashierPosTable,
  IGetCashierTablesParams,
  ICashierMenuItem,
  IGetCashierMenuParams,
  ICashierTableBillResponse,
  ICashierCheckoutPayload,
  ICashierCheckoutResponse,
} from "./cashierHubAndOrderMenuType";

export const cashierHubAndOrderMenuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Live POS Tables & Bar Stations
    getCashierTables: builder.query<ICashierPosTable[], IGetCashierTablesParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.type) {
          queryParams.append("type", params.type);
        }
        if (params?.status && params.status !== "ALL") {
          queryParams.append("status", params.status);
        }
        if (params?.search && params.search.trim() !== "") {
          queryParams.append("search", params.search.trim());
        }
        const queryString = queryParams.toString();
        return {
          url: `/cashier/tables${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["CashierTables"],
    }),

    // 2. Get Order Menu Dishes
    getCashierMenu: builder.query<ICashierMenuItem[], IGetCashierMenuParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.category && params.category !== "ALL" && params.category !== "all") {
          queryParams.append("category", params.category);
        }
        if (params?.search && params.search.trim() !== "") {
          queryParams.append("search", params.search.trim());
        }
        const queryString = queryParams.toString();
        return {
          url: `/cashier/menu${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["CashierMenu"],
    }),

    // 3. Get Table Bill Details
    getCashierTableBill: builder.query<ICashierTableBillResponse, string | number>({
      query: (tableId) => ({
        url: `/cashier/tables/${tableId}/bill`,
        method: "GET",
      }),
      providesTags: ["CashierTables"],
    }),

    // 4. Complete Checkout & Payment Settle
    processCashierCheckout: builder.mutation<ICashierCheckoutResponse, ICashierCheckoutPayload>({
      query: (body) => ({
        url: "/cashier/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "CashierTables",
        "Tables",
        "Orders",
        "ServeTables",
        "ServeOrders",
        "KitchenTickets",
        "KitchenSummary",
      ],
    }),
  }),
});

export const {
  useGetCashierTablesQuery,
  useGetCashierMenuQuery,
  useGetCashierTableBillQuery,
  useProcessCashierCheckoutMutation,
} = cashierHubAndOrderMenuApi;
