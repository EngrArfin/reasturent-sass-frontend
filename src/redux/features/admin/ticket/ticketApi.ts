import { baseApi } from "@/redux/hooks/baseApi";
import {
  ISupportTicket,
  ITicketMessage,
  ICreateTicketRequest,
  IUpdateTicketRequest,
  IAddTicketMessageRequest,
  IUpdateTicketStatusRequest,
  IQueryTicketParams,
} from "./ticketType";

export * from "./ticketType";

export const ticketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Support History / Global Ticket Queue
    getSupportTickets: builder.query<ISupportTicket[], IQueryTicketParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status && params.status !== "ALL") {
          queryParams.append("status", params.status);
        }
        if (params?.category) queryParams.append("category", params.category);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.businessId) queryParams.append("businessId", params.businessId);
        const qs = queryParams.toString();
        return {
          url: `/tickets${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        const list = Array.isArray(response)
          ? response
          : response?.data || response?.tickets || [];
        return list.map((t: any) => ({
          ...t,
          category: t.category || t.title || "Support Request",
          businessName:
            t.business?.businessName ||
            t.business?.name ||
            t.businessName ||
            "Restaurant Tenant",
          messagesCount:
            t._count?.messages ??
            t.messageCount ??
            t.messagesCount ??
            (Array.isArray(t.messages) ? t.messages.length : 1),
          time: t.createdAt
            ? new Date(t.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
            : "",
        }));
      },
      providesTags: ["SupportTickets"],
    }),

    // 2. Get Ticket Details by ID & Chat Thread
    getSupportTicketById: builder.query<ISupportTicket, string>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const ticket = response?.data || response;
        if (!ticket) return ticket;
        return {
          ...ticket,
          category: ticket.category || ticket.title || "Support Request",
          businessName:
            ticket.business?.businessName ||
            ticket.business?.name ||
            ticket.businessName ||
            "Restaurant Tenant",
          messages: (ticket.messages || []).map((m: any) => {
            const isAdmin =
              m.senderRole === "super_admin" ||
              m.senderRole === "admin" ||
              m.sender === "admin";
            return {
              ...m,
              text: m.message || m.text || "",
              sender: isAdmin ? "admin" : "user",
              senderName:
                m.senderName ||
                m.user?.name ||
                (isAdmin ? "Support Admin" : "You"),
              time: m.createdAt
                ? new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : m.time || "",
            };
          }),
        };
      },
      providesTags: (_result, _error, id) => [{ type: "SupportTickets", id }],
    }),

    // 3. Create Support Ticket
    createSupportTicket: builder.mutation<ISupportTicket, ICreateTicketRequest>({
      query: (body) => ({
        url: "/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SupportTickets"],
    }),

    // 4. Send Message in Ticket Thread
    addTicketMessage: builder.mutation<ITicketMessage, IAddTicketMessageRequest>({
      query: ({ id, message }) => ({
        url: `/tickets/${id}/messages`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SupportTickets", id },
        "SupportTickets",
      ],
    }),

    // 5. Update Ticket Status (e.g. RESOLVED, CLOSED, OPEN)
    updateSupportTicketStatus: builder.mutation<
      ISupportTicket,
      IUpdateTicketStatusRequest
    >({
      query: ({ id, status }) => ({
        url: `/tickets/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SupportTickets", id },
        "SupportTickets",
      ],
    }),

    // 6. Update Ticket Details
    updateSupportTicket: builder.mutation<
      ISupportTicket,
      { id: string; data: IUpdateTicketRequest }
    >({
      query: ({ id, data }) => ({
        url: `/tickets/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SupportTickets", id },
        "SupportTickets",
      ],
    }),

    // 7. Delete Ticket (SUPER_ADMIN)
    deleteSupportTicket: builder.mutation<
      { success: boolean; message?: string },
      string
    >({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SupportTickets"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSupportTicketsQuery,
  useGetSupportTicketByIdQuery,
  useCreateSupportTicketMutation,
  useAddTicketMessageMutation,
  useUpdateSupportTicketStatusMutation,
  useUpdateSupportTicketMutation,
  useDeleteSupportTicketMutation,
} = ticketApi;

