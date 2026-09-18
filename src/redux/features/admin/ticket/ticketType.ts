export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | string;
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT" | string;

export interface ITicketMessage {
  id: string;
  ticketId?: string;
  sender?: "user" | "admin";
  senderId?: string;
  senderName: string;
  senderRole?: string;
  senderLabel?: string;
  message?: string;
  text?: string;
  isMe?: boolean;
  time: string;
  createdAt?: string;
  timestamp?: string;
}

export interface ISupportTicket {
  id: string;
  title: string;
  category?: string;
  description: string;
  status: TicketStatus;
  priority?: TicketPriority;
  deviceId?: string;
  softwareVersion?: string;
  lastSync?: string | null;
  lastSyncFormatted?: string | null;
  businessId?: string | null;
  businessName?: string;
  business?: {
    id: string;
    businessName: string;
    name?: string;
  };
  messagesCount?: number;
  messageCount?: number;
  time?: string;
  createdById?: string | null;
  createdAt: string;
  updatedAt?: string;
  messages?: ITicketMessage[];
}

export interface ICreateTicketRequest {
  category: string;
  description: string;
  title?: string;
  deviceId?: string;
  softwareVersion?: string;
  lastSync?: string;
  priority?: TicketPriority;
  businessId?: string;
}

export interface IUpdateTicketRequest {
  title?: string;
  category?: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
}

export interface IAddTicketMessageRequest {
  id: string;
  message: string;
}

export interface IUpdateTicketStatusRequest {
  id: string;
  status: TicketStatus;
}

export interface IQueryTicketParams {
  status?: string;
  category?: string;
  search?: string;
  businessId?: string;
}

// Aliases for compatibility
export type SupportTicketItem = ISupportTicket;
export type TicketMessage = ITicketMessage;
export type CreateTicketDto = ICreateTicketRequest;
export type UpdateTicketDto = IUpdateTicketRequest;
