// src/redux/features/server/serverTableAndStatusApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  IGetServeTablesResponse,
  IUpdateServeTableStatusPayload,
  IApiMessageResponse,
  IGetServeMenuResponse,
  ISendOrderToKitchenPayload,
  IApiResponse,
  IServeOrderTicket,
  IGetServeOrdersResponse,
  IGetServeOrdersParams,
  IUpdateServeOrderStatusPayload,
} from "./serverTableAndStatusType";

export const serverTableAndStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Table Map
    getServeTables: builder.query<IGetServeTablesResponse, void>({
      query: () => ({
        url: "/serve/tables",
        method: "GET",
      }),
      providesTags: ["ServeTables"],
    }),

    // 2. Update Table Status
    updateServeTableStatus: builder.mutation<IApiMessageResponse, IUpdateServeTableStatusPayload>({
      query: ({ id, status, subStatus }) => ({
        url: `/serve/tables/${id}/status`,
        method: "PATCH",
        body: { status, subStatus },
      }),
      invalidatesTags: ["ServeTables", "ServeOrders", "KitchenTickets", "KitchenSummary", "Tables", "Orders"],
    }),

    // 3. Get Menu Dishes For Ordering
    getServeMenu: builder.query<IGetServeMenuResponse, void>({
      query: () => ({
        url: "/serve/menu",
        method: "GET",
      }),
      providesTags: ["ServeMenu"],
    }),

    // 4. Send Order to Kitchen
    sendOrderToKitchen: builder.mutation<IApiResponse<IServeOrderTicket>, ISendOrderToKitchenPayload>({
      query: (body) => ({
        url: "/serve/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ServeOrders", "ServeTables", "KitchenTickets", "KitchenSummary", "Orders", "Tables"],
    }),

    // 5. Get Table Order Status List
    getServeOrders: builder.query<IGetServeOrdersResponse, IGetServeOrdersParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status && params.status !== "ALL") {
          queryParams.append("status", params.status);
        }
        const queryString = queryParams.toString();
        return {
          url: `/serve/orders${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["ServeOrders"],
    }),

    // 6. Update Order Ticket Status
    updateServeOrderStatus: builder.mutation<IApiMessageResponse, IUpdateServeOrderStatusPayload>({
      query: ({ id, status }) => ({
        url: `/serve/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["ServeOrders", "ServeTables", "KitchenTickets", "KitchenSummary", "Orders", "Tables"],
    }),
  }),
});

export const {
  useGetServeTablesQuery,
  useUpdateServeTableStatusMutation,
  useGetServeMenuQuery,
  useSendOrderToKitchenMutation,
  useGetServeOrdersQuery,
  useUpdateServeOrderStatusMutation,
} = serverTableAndStatusApi;
