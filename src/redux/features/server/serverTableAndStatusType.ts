// src/redux/features/server/serverTableAndStatusType.ts

// =========================================================================
// 1. Common & Summary Types
// =========================================================================
export interface IServeSummary {
  total: number;
  occupied: number;
  available: number;
  reserved: number;
}

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface IApiMessageResponse {
  success: boolean;
  message: string;
}

// =========================================================================
// 2. Serve Table Map Types
// =========================================================================
export type ServeTableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING";

export interface IServeTable {
  id: string;
  tableNumber: string;
  capacity: string; // e.g. "4 Persons", "8 Persons"
  section: string; // e.g. "Main ", "Bar Area", "Patio Terrace", "Window Bay"
  status: ServeTableStatus;
  subStatus?: string; // e.g. "PREPARING", "SERVED", "ORDER_PLACED", "CONFIRMED", "-"
  isActive?: boolean;
  businessId?: string;
}

export interface IGetServeTablesResponse {
  success: boolean;
  summary?: IServeSummary;
  data: IServeTable[];
}

export interface IUpdateServeTableStatusPayload {
  id: string;
  status: ServeTableStatus | string;
  subStatus?: string;
}

// =========================================================================
// 3. Serve Menu Types
// =========================================================================
export interface IServeMenuItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface IGetServeMenuResponse {
  success: boolean;
  data: IServeMenuItem[];
}

// =========================================================================
// 4. Serve Orders & Kitchen Tickets Types
// =========================================================================
export interface IServeOrderItemPayload {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface ISendOrderToKitchenPayload {
  tableNumber: string;
  tableId: string;
  notes?: string;
  items: IServeOrderItemPayload[];
}

export interface IServeTicketItem {
  id?: string;
  orderId?: string;
  menuItemId?: string;
  name: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  notes?: string;
  tags?: string[];
  createdAt?: string;
}

export type TicketStatus =
  | "Confirmed"
  | "In Kitchen"
  | "Ready to Serve"
  | "Served"
  | "Cancelled"
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export interface IServeOrderTicket {
  id: string;
  ticketId: string;
  tableNumber: string;
  time?: string;
  status: TicketStatus | string;
  rawStatus?: string;
  totalBill: number;
  items: IServeTicketItem[];
  readyNotice?: boolean;
  notes?: string;
  createdAt?: string;
}

export interface IGetServeOrdersResponse {
  success: boolean;
  count?: number;
  data: IServeOrderTicket[];
}

export interface IGetServeOrdersParams {
  status?: string;
}

export interface IUpdateServeOrderStatusPayload {
  id: string;
  status: TicketStatus | string;
}
