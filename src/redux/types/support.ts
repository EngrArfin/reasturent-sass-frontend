export interface Comment {
  id: string;
  content: string;
  ticketId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    email: string;
    role: string;
  };
}

export type TicketStatus = "OPEN" | "PENDING" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";
export type TicketCategory = "GENERAL_INQUIRY" | string; // Add other possible categories

export interface SupportTicket {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  attachementLiveLinks: string[];
  marchentId: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  comments: Comment[];
}

export interface SupportTicketsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SupportTicketsData {
  data: SupportTicket[];
  meta: SupportTicketsMeta;
}

export interface SupportTicketsResponse {
  success: boolean;
  message: string;
  data: SupportTicketsData;
}
