// src/redux/features/kitchen/kitchenProductionApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  IGetKitchenSummaryResponse,
  IGetKitchenSummaryParams,
  IGetKitchenTicketsResponse,
  IGetKitchenTicketsParams,
  ICreateKitchenTicketPayload,
  ICreateKitchenTicketResponse,
  IBumpTicketPayload,
  IBumpTicketResponse,
} from "./kitchenProductionType";

export const kitchenProductionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Kitchen KPI Summary Metrics
    getKitchenSummary: builder.query<IGetKitchenSummaryResponse, IGetKitchenSummaryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.businessId) {
          queryParams.append("businessId", params.businessId);
        }
        const queryString = queryParams.toString();
        return {
          url: `/kitchen/summary${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["KitchenSummary"],
    }),

    // 2. Get Kitchen Live Tickets Stream
    getKitchenTickets: builder.query<IGetKitchenTicketsResponse, IGetKitchenTicketsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.tab) {
          queryParams.append("tab", params.tab);
        }
        if (params?.search && params.search.trim() !== "") {
          queryParams.append("search", params.search.trim());
        }
        if (params?.station && params.station !== "ALL") {
          queryParams.append("station", params.station);
        }
        if (params?.businessId) {
          queryParams.append("businessId", params.businessId);
        }
        const queryString = queryParams.toString();
        return {
          url: `/kitchen/tickets${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["KitchenTickets"],
    }),

    // 3. Create Manual Kitchen Ticket (+ New Ticket)
    createKitchenTicket: builder.mutation<ICreateKitchenTicketResponse, ICreateKitchenTicketPayload>({
      query: (body) => ({
        url: "/kitchen/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["KitchenTickets", "KitchenSummary", "Orders", "ServeOrders", "ServeTables", "Tables"],
    }),

    // 4. Bump Ticket Status (Bump To Ready / Complete)
    bumpKitchenTicket: builder.mutation<IBumpTicketResponse, IBumpTicketPayload>({
      query: ({ id, targetStatus, station }) => ({
        url: `/kitchen/tickets/${id}/bump`,
        method: "PATCH",
        body: { targetStatus, station },
      }),
      invalidatesTags: ["KitchenTickets", "KitchenSummary", "Orders", "ServeOrders", "ServeTables", "Tables"],
    }),
  }),
});

export const {
  useGetKitchenSummaryQuery,
  useGetKitchenTicketsQuery,
  useCreateKitchenTicketMutation,
  useBumpKitchenTicketMutation,
} = kitchenProductionApi;
