export interface Customer {
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
  AddParcel: Parcel[];
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
  status: string;
  deliveryStatus: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CustomersResponse {
  success: boolean;
  message: string;
  data: {
    data: Customer[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    newCustomers: number;
    totalCustomers: number;
  };
}
