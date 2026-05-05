// src/redux/types/merchant/merchant.customer.ts
export interface AddCustomerPayload {
  Name: string;
  Email: string;
  Phone: string;
  postalCode: string;
  ShippingAddress: string;
  BillingAddress: string;
  status?: "Active" | "Inactive" | "VIP";
}

export interface Parcel {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  merchantId: string;
  Name: string;
  Email: string;
  Phone: string;
  ShippingAddress: string;
  BillingAddress: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  AddParcel: Parcel[];
  status?: "Active" | "Inactive" | "VIP";
  totalOrders?: number;
}

export interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CustomerListData {
  data: Customer[];
  meta: MetaData;
  newCustomers: number;
  totalCustomers: number;
}

export interface CustomerListResponse {
  success: boolean;
  message: string;
  data: CustomerListData;
}

export interface CustomerDetailsResponse {
  success: boolean;
  message: string;
  data: Customer;
}