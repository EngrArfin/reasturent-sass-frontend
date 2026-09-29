import { baseApi } from "@/redux/hooks/baseApi";
import {
  CommonNotificationActionResponse,
  CreateNotificationPayload,
  MarkAllReadResponse,
  NotificationItem,
  NotificationPreferences,
  NotificationsQueryParams,
  NotificationsResponse,
  UnreadCountResponse,
  UpdatePreferencesResponse,
} from "./notificationsType";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Notifications Feed with optional filters, search, pagination
    getNotifications: builder.query<NotificationsResponse, NotificationsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.filter && params.filter !== "ALL") {
          queryParams.append("filter", params.filter);
        }
        if (params?.search && params.search.trim() !== "") {
          queryParams.append("search", params.search.trim());
        }
        if (params?.page) {
          queryParams.append("page", params.page.toString());
        }
        if (params?.limit) {
          queryParams.append("limit", params.limit.toString());
        }
        if (params?.businessId) {
          queryParams.append("businessId", params.businessId);
        }

        const queryString = queryParams.toString();
        return {
          url: queryString ? `/notifications?${queryString}` : "/notifications",
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Notifications" as const, id })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),

    // 2. Get Unread Notifications Count (for Navbar badge counter)
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => ({
        url: "/notifications/unread-count",
        method: "GET",
      }),
      providesTags: [{ type: "Notifications", id: "UNREAD_COUNT" }],
    }),

    // 3. Get Notification Preferences
    getNotificationPreferences: builder.query<NotificationPreferences, void>({
      query: () => ({
        url: "/notifications/preferences",
        method: "GET",
      }),
      providesTags: [{ type: "NotificationPreferences", id: "CURRENT" }],
    }),

    // 4. Update Notification Preferences
    updateNotificationPreferences: builder.mutation<
      UpdatePreferencesResponse,
      Partial<NotificationPreferences>
    >({
      query: (preferences) => ({
        url: "/notifications/preferences",
        method: "PATCH",
        body: preferences,
      }),
      invalidatesTags: [{ type: "NotificationPreferences", id: "CURRENT" }],
    }),

    // 5. Create Notification Alert
    createNotification: builder.mutation<NotificationItem, CreateNotificationPayload>({
      query: (payload) => ({
        url: "/notifications",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD_COUNT" },
      ],
    }),

    // 6. Mark All Notifications as Read
    markAllNotificationsAsRead: builder.mutation<MarkAllReadResponse, void>({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD_COUNT" },
      ],
    }),

    // 7. Clear All Notifications
    clearAllNotifications: builder.mutation<CommonNotificationActionResponse, void>({
      query: () => ({
        url: "/notifications/clear-all",
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD_COUNT" },
      ],
    }),

    // 8. Mark Single Notification as Read
    markNotificationAsRead: builder.mutation<NotificationItem & { success?: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notifications", id },
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD_COUNT" },
      ],
    }),

    // 9. Toggle Single Notification Read/Unread Status
    toggleNotificationRead: builder.mutation<NotificationItem & { success?: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}/toggle-read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notifications", id },
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD_COUNT" },
      ],
    }),

    // 10. Delete Single Notification
    deleteNotification: builder.mutation<CommonNotificationActionResponse, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notifications", id },
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD_COUNT" },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  useCreateNotificationMutation,
  useMarkAllNotificationsAsReadMutation,
  useClearAllNotificationsMutation,
  useMarkNotificationAsReadMutation,
  useToggleNotificationReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
