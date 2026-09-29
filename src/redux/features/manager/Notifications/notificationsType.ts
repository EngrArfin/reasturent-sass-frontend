export type NotificationCategoryType = "ALL" | "UNREAD" | "SYSTEM" | "TICKETS" | "ORDERS";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "TICKETS" | "SYSTEM" | "ORDERS" | string;
  category?: string;
  isRead: boolean;
  link?: string;
  userId?: string;
  businessId?: string;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt?: string;
  relativeTime?: string;
}

export interface NotificationsResponse {
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
  items: NotificationItem[];
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  lowStockAlerts: boolean;
  syncErrorAlerts: boolean;
}

export interface UpdatePreferencesResponse {
  success: boolean;
  message: string;
  preferences: NotificationPreferences;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface NotificationsQueryParams {
  filter?: NotificationCategoryType | string;
  search?: string;
  page?: number;
  limit?: number;
  businessId?: string;
}

export interface CreateNotificationPayload {
  title: string;
  message: string;
  type: "TICKETS" | "SYSTEM" | "ORDERS" | string;
  category?: string;
  link?: string;
  businessId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface MarkAllReadResponse {
  success: boolean;
  count: number;
  message: string;
}

export interface CommonNotificationActionResponse {
  success: boolean;
  message?: string;
  [key: string]: any;
}
