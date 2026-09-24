// src/redux/features/kitchen/kitchenProductionType.ts

// =========================================================================
// 1. Kitchen Summary Metrics (/kitchen/summary)
// =========================================================================
export interface IKitchenCompletedToday {
  count: number;
  growth: string;
}

export interface IKitchenAvgPrepTime {
  time: string;
  target: string;
}

export interface IKitchenStationAlert {
  station: string;
  capacityPercent: number;
  message: string;
  isAlert: boolean;
}

export interface IKitchenSummaryData {
  completedToday: IKitchenCompletedToday;
  avgPrepTime: IKitchenAvgPrepTime;
  stationAlert: IKitchenStationAlert;
}

export interface IGetKitchenSummaryResponse {
  success: boolean;
  data: IKitchenSummaryData;
}

export interface IGetKitchenSummaryParams {
  businessId?: string;
}

// =========================================================================
// 2. Kitchen Live Tickets Stream (/kitchen/tickets)
// =========================================================================
export interface IKitchenTicketItem {
  id?: string;
  name: string;
  quantity: number;
  modifiers?: string[];
  station?: string;
  notes?: string;
}

export type KitchenTicketStatus = "Preparing" | "Ready" | "Completed" | string;
export type KitchenTicketRawStatus = "PENDING" | "PREPARING" | "READY" | "COMPLETED" | string;
export type KitchenTicketTab = "ACTIVE" | "COMPLETED";

export interface IKitchenTicket {
  id: string;
  ticketId: string;
  orderNumber?: string;
  tableNumber: string | number;
  inTime: string;
  station?: string;
  status: KitchenTicketStatus;
  rawStatus: KitchenTicketRawStatus;
  subStatusLabel?: string | null;
  actionLabel?: string;
  nextStatus?: "READY" | "COMPLETED" | string;
  isActionDisabled?: boolean;
  items: IKitchenTicketItem[];
  createdAt: string;
}

export interface IGetKitchenTicketsResponse {
  success: boolean;
  tab?: KitchenTicketTab | string;
  data: IKitchenTicket[];
}

export interface IGetKitchenTicketsParams {
  tab?: KitchenTicketTab | string;
  search?: string;
  station?: string;
  businessId?: string;
}

// =========================================================================
// 3. Create Manual Kitchen Ticket (POST /kitchen/tickets)
// =========================================================================
export interface ICreateKitchenTicketItemPayload {
  name: string;
  quantity: number;
  modifiers?: string[];
  station?: string;
}

export interface ICreateKitchenTicketPayload {
  tableNumber: string;
  station?: string;
  items: ICreateKitchenTicketItemPayload[];
  businessId?: string;
}

export interface ICreateKitchenTicketResponseItem {
  id: string;
  orderId: string;
  menuItemId?: string | null;
  name: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  notes?: string | null;
  createdAt: string;
}

export interface ICreateKitchenTicketData {
  id: string;
  orderNumber: string;
  tableNumber: string;
  status: string;
  totalBill: number;
  notes?: string | null;
  tableId?: string | null;
  businessId?: string;
  createdAt: string;
  updatedAt: string;
  items: ICreateKitchenTicketResponseItem[];
}

export interface ICreateKitchenTicketResponse {
  success: boolean;
  message: string;
  data: ICreateKitchenTicketData;
}

// =========================================================================
// 4. Bump Ticket Status (PATCH /kitchen/tickets/{id}/bump)
// =========================================================================
export interface IBumpTicketPayload {
  id: string;
  targetStatus: "READY" | "COMPLETED" | string;
  station?: string;
}

export interface IBumpTicketResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    orderNumber: string;
    tableNumber: string;
    status: string;
    totalBill?: number;
    notes?: string | null;
    tableId?: string | null;
    businessId?: string;
    createdAt: string;
    updatedAt: string;
  };
}
