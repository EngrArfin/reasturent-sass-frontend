import { baseApi } from "@/redux/hooks/baseApi";

export interface TicketMessage {
  id: string;
  sender: "user" | "admin";
  senderName: string;
  role?: string;
  text: string;
  time: string;
  timestamp?: string;
}

export interface SupportTicketItem {
  id: string;
  title: string;
  description: string;
  businessName: string;
  businessId?: string;
  status: "OPEN" | "CLOSED" | "PENDING" | "RESOLVED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  messagesCount: number;
  time: string;
  createdAt: string;
  messages: TicketMessage[];
}

export const ticketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupportTickets: builder.query<any, void>({
      query: () => ({
        url: "/tickets",
        method: "GET",
      }),
      providesTags: ["SupportTickets"],
    }),
    getSupportTicketById: builder.query<any, string>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "SupportTickets", id }],
    }),
    updateSupportTicketStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/tickets/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["SupportTickets"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSupportTicketsQuery,
  useGetSupportTicketByIdQuery,
  useUpdateSupportTicketStatusMutation,
} = ticketApi;
