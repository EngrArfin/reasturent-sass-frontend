// src/redux/features/manager/ManageFood/manageFoodType.ts

// ==========================================
// 1. Pagination & Common Interfaces
// ==========================================
export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface IApiDeleteResponse {
  success: boolean;
  message: string;
}

// ==========================================
// 2. Floor Tables Types & Interfaces
// ==========================================
export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING";

export interface ITable {
  id: string;
  tableNumber: string;
  capacity: string; // e.g., "4 Persons"
  section: string; // e.g., "Main Hall", "Patio Terrace", "VIP Lounge", "Window Bay"
  status: TableStatus;
  subStatus?: string; // e.g., "SERVED", "ORDER_PLACED", "PREPARING", "PAYMENT_PENDING", "-"
  isActive?: boolean;
  businessId?: string;
  activeOrderId?: string | null;
  activeOrderNumber?: string | null;
  orders?: IOrder[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ITableSummary {
  total: number;
  occupied: number;
  available: number;
  reserved: number;
}

export interface IGetTablesResponse {
  success: boolean;
  summary?: ITableSummary;
  data: ITable[];
  pagination?: IPagination;
}

export interface IGetTablesParams {
  search?: string;
  status?: string;
  section?: string;
  page?: number;
  limit?: number;
  businessId?: string;
}

export interface ICreateTablePayload {
  tableNumber: string;
  capacity: string;
  section: string;
  status?: TableStatus;
  subStatus?: string;
  businessId?: string;
}

export interface IUpdateTablePayload {
  id: string;
  tableNumber?: string;
  capacity?: string;
  section?: string;
  status?: TableStatus;
  subStatus?: string;
  businessId?: string;
}

// ==========================================
// 3. Menu Items / Food Catalog Types
// ==========================================
export interface IMenuItem {
  id: string;
  name: string;
  description?: string;
  category: string; // "Main Course" | "Appetizer" | "Dessert" | "Beverage" | "Special"
  price: number;
  formattedPrice?: string;
  prepTime?: string;
  isAvailable: boolean;
  availability?: string; // "In Stock" | "Out of Stock"
  imageUrl?: string;
  isActive?: boolean;
  businessId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGetMenuItemsResponse {
  success: boolean;
  categories?: string[];
  data: IMenuItem[];
  pagination?: IPagination;
}

export interface IGetMenuItemsParams {
  search?: string;
  category?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  businessId?: string;
}

export interface ICreateMenuItemPayload {
  name: string;
  description?: string;
  category: string;
  price: number;
  prepTime?: string;
  isAvailable?: boolean;
  imageUrl?: string;
  businessId?: string;
}

export interface IUpdateMenuItemPayload {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  prepTime?: string;
  isAvailable?: boolean;
  imageUrl?: string;
  businessId?: string;
}

// ==========================================
// 4. Kitchen & Active Orders Types
// ==========================================
export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export interface IOrderItemPayload {
  menuItemId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface IOrderItem {
  id?: string;
  orderId?: string;
  menuItemId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  formattedTotalPrice?: string;
  notes?: string;
  createdAt?: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  tableId?: string;
  tableNumber: string;
  status: OrderStatus;
  totalBill: number;
  formattedTotal?: string;
  notes?: string;
  actionButton?: string; // e.g., "Start Prep", "Mark Served", "Complete Bill"
  nextStatus?: OrderStatus;
  items: IOrderItem[];
  table?: ITable;
  businessId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrderSummary {
  total: number;
  pending: number;
  preparing: number;
  served: number;
  completed: number;
}

export interface IGetOrdersResponse {
  success: boolean;
  summary?: IOrderSummary;
  data: IOrder[];
  pagination?: IPagination;
}

export interface IGetOrdersParams {
  search?: string;
  status?: string;
  tableId?: string;
  page?: number;
  limit?: number;
  businessId?: string;
}

export interface ICreateOrderPayload {
  orderNumber?: string;
  tableId?: string;
  tableNumber: string;
  status?: OrderStatus;
  notes?: string;
  items: IOrderItemPayload[];
  businessId?: string;
}

export interface IUpdateOrderPayload {
  id: string;
  orderNumber?: string;
  tableId?: string;
  tableNumber?: string;
  status?: OrderStatus;
  notes?: string;
  items?: IOrderItemPayload[];
  businessId?: string;
}

export interface IUpdateOrderStatusPayload {
  id: string;
  status: OrderStatus;
}
