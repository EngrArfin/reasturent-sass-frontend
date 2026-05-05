// src/redux/features/notification/notificationApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  MarkAsReadResponse,
  NotificationResponse,
} from "@/redux/types/notification";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<NotificationResponse, void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),
    markNotificationAsRead: build.mutation<MarkAsReadResponse, string>({
      query: (id) => ({
        url: `/notifications/read/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    deleteNotification: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/notifications/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
