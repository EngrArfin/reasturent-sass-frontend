export interface IVoucher {
  id: string;
  name: string;
  code?: string;
  subscriptionCode?: string;
  minimumPrice: number;
  offPrice: string; // e.g. "15.3%" or "10%"
  amountOff?: number;
  finalPrice?: number;
  requestedBy: string;
  requestedByFormatted?: string;
  originalFormatted?: string;
  discountFormatted?: string;
  finalFormatted?: string;
  isActive?: boolean;
  isUsed?: boolean;
  usage?: string;
  expiresAt?: string;
  expiryDate?: string;
  status?: string;
  businessId?: string;
  businessName?: string;
  business?: {
    id: string;
    businessName: string;
    name?: string;
  };
  createdAt?: string;
  updatedAt?: string;

  // Compatibility helpers if needed
  minPrice?: number;
  originalPrice?: number;
  discountPercent?: number;
  discountAmount?: number;
}

export interface ICreateVoucherRequest {
  name: string;
  minimumPrice: number;
  offPrice: string;
  requestedBy?: string;
  code?: string;
  expiresAt?: string;
  isUsed?: boolean;
  businessId?: string;
  isActive?: boolean;
}

export interface IUpdateVoucherRequest {
  name?: string;
  minimumPrice?: number;
  offPrice?: string;
  requestedBy?: string;
  code?: string;
  expiresAt?: string;
  isUsed?: boolean;
  businessId?: string;
  isActive?: boolean;
}

export interface IDeleteVoucherResponse {
  message: string;
  id: string;
  name: string;
}

// Aliases for compatibility
export type VoucherItem = IVoucher;
export type CreateVoucherDto = ICreateVoucherRequest;
export type UpdateVoucherDto = IUpdateVoucherRequest;
