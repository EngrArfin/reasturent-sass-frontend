// src/redux/api/supportApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import { SupportTicket, SupportTicketsResponse } from "@/redux/types/support";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupportTickets: builder.query<SupportTicketsResponse, void>({
      query: () => ({
        url: "/support/all-support-requests",
        method: "GET",
      }),
      providesTags: ["SupportTickets"],
      keepUnusedDataFor: 300,
    }),
    /* PATCH */
    updateSupportStatus: builder.mutation<
      SupportTicket,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/support/change-support-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["SupportTickets"],
    }),
  }),
});

export const { useGetSupportTicketsQuery, useUpdateSupportStatusMutation } =
  supportApi;
