// src/types/parcel.ts

// Base parcel interface
export interface Parcel {
  id: string;
  marchentId: string;
  trackingId: string;
  trackingLink?: string;
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
  shipdayOrderId: number | null;
  status: string;
  deliveryStatus: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  user: {
    name: string;
    businessName: string;
    address_Pickup_Location: string;
    phone: string;
    email: string;
    role: string;
    status: string;
  };
  customar: {
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
  };
  address: {
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
  };
  sender?: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  recipient?: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
}

// API response structure
export interface ParcelApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Parcel[]; // This is the array of parcels
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    cardData: {
      totalPending: number;
      todayPending: number;
      totalDelivered: number;
      todayDelivered: number;
    };
  };
}

// // src/types/parcel.ts
// export interface Parcel {
//   id: string;
//   marchentId: string;
//   trackingId: string;
//   trackingLink?: string;
//   type: string;
//   name: string;
//   weight: string;
//   length: string;
//   width: string;
//   height: string;
//   description: string;
//   customerId: string;
//   addressId: string;
//   invoice: string | null;
//   notes: string | null;

//   data: Parcel;

//   shipdayOrderId: number | null;
//   status: string;
//   deliveryStatus: string;
//   amount: number;
//   paymentStatus: string;
//   createdAt: string;
//   updatedAt: string;
//   isDeleted: boolean;
//   user: {
//     name: string;
//     businessName: string;
//     address_Pickup_Location: string;
//     phone: string;
//     email: string;
//     role: string;
//     status: string;
//   };
//   customar: {
//     id: string;
//     marchentId: string;
//     Name: string;
//     Email: string;
//     Phone: string;
//     ShippingAddress: string;
//     BillingAddress: string;
//     postalCode: string;
//     createdAt: string;
//     updatedAt: string;
//     isDeleted: boolean;
//   };
//   address: {
//     id: string;
//     marchentId: string;
//     addressName: string;
//     streetName: string;
//     cityOrSuburb: string;
//     postalCode: string;
//     country: string;
//     phoneNumber: string;
//     additionalNotes: string;
//     createdAt: string;
//     updatedAt: string;
//     isDeleted: boolean;
//   };
//   // ✅ Added sender & recipient fields to fix type errors
//   sender?: {
//     name: string;
//     phone?: string;
//     email?: string;
//     address?: string;
//   };

//   recipient?: {
//     name: string;
//     phone?: string;
//     email?: string;
//     address?: string;
//   };
// }
