// src/types/notification.ts
export interface INotification {
  id: string;
  title: string;
  isRead: boolean;
  parcelId: string;
  createdAt: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: INotification[];
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
  data: INotification;
}
