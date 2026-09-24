// src/redux/features/cashier/cashierHubAndOrderMenuType.ts

// =========================================================================
// 1. Live POS Tables & Bar Stations (/cashier/tables)
// =========================================================================
export type CashierStationType = "table" | "bar";
export type CashierTableStatus = "ALL" | "empty" | "served" | "occupied" | "billing" | string;

export interface ICashierTableItemDetail {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
}

export interface ICashierPosTable {
  id: string | number;
  tableNumber: number | string;
  type: CashierStationType;
  label: string;
  status: CashierTableStatus;
  totalAmount?: number;
  items?: ICashierTableItemDetail[];
  orderId?: string;
  guestCount?: number;
  orderTime?: string;
}

export interface IGetCashierTablesParams {
  type?: CashierStationType;
  status?: string;
  search?: string;
}

// =========================================================================
// 2. Order Menu Dishes (/cashier/menu)
// =========================================================================
export interface ICashierMenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  isVeg?: boolean;
  image?: string;
}

export interface IGetCashierMenuParams {
  category?: string;
  search?: string;
}

// =========================================================================
// 3. Table Bill Details (/cashier/tables/{tableId}/bill)
// =========================================================================
export interface ICashierActiveOrder {
  id?: string;
  orderNumber?: string;
  totalAmount: number;
  items?: ICashierTableItemDetail[];
}

export interface ICashierTableBillResponse {
  tableId: string;
  tableNumber: string | number;
  status: string;
  activeOrder?: ICashierActiveOrder | null;
}

// =========================================================================
// 4. Complete Checkout & Payment Settle (POST /cashier/checkout)
// =========================================================================
export type PaymentMethod = "ONLINE" | "CARD" | "CASH";
export type OnlineProvider = "BKASH" | "NAGAD" | "ROCKET" | "UPAY";
export type CardType = "VISA" | "MASTERCARD" | "AMEX" | "POS";

export interface ICashierCheckoutPayload {
  tableId: string;
  orderId?: string;
  paymentMethod: PaymentMethod;
  onlineProvider?: OnlineProvider;
  cardType?: CardType;
  trxId?: string;
  totalAmount: number;
  discountPercent?: number;
  tenderedCash?: number;
  changeDue?: number;
  printReceipt?: boolean;
}

export interface ICashierCheckoutResponse {
  success: boolean;
  message: string;
  receiptNumber?: string;
  timestamp?: string;
  transactionDetails?: ICashierCheckoutPayload;
}
