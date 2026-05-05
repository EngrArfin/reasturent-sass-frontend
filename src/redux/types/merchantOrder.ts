// src/types/merchantParcel.ts
export interface ParcelCustomer {
  id: string;
  marchentId: string;
  Name: string;
  Email: string;
  Phone: string;
  ShippingAddress: string;
  BillingAddress: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface ParcelAddress {
  id: string;
  marchentId: string;
  addressName: string;
  streetName: string;
  cityOrSuburb: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  additionalNotes: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Parcel {
  id: string;
  marchentId: string;
  type: string;
  name: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  description: string;
  customerId: string;
  addressId: string;
  invoice: string | null;
  notes: string | null;
  trackingId: string;
  shipdayOrderId: number | null;
  trackingLink: string | null;
  status: string;
  deliveryStatus: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  customar: ParcelCustomer;
  address: ParcelAddress;
}

export interface MerchantParcelMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MerchantParcelCardData {
  totalPending: number;
  todayPending: number;
  totalDelivered: number;
  todayDelivered: number;
}

export interface MerchantParcelData {
  data: Parcel[];
  meta: MerchantParcelMeta;
  cardData: MerchantParcelCardData;
}

export interface MerchantParcelResponse {
  success: boolean;
  message: string;
  data: MerchantParcelData;
}
