export interface IVoucher {
  id: string;
  name: string;
  code: string;
  subscriptionCode?: string;
  minimumPrice: number;
  offPrice: string;
  amountOff: number;
  finalPrice: number;
  requestedBy: string;
  requestedByFormatted?: string;
  originalFormatted?: string;
  discountFormatted?: string;
  finalFormatted?: string;
  isActive: boolean;
  isUsed: boolean;
  usage?: string;
  expiresAt: string | null;
  expiryDate?: string;
  status?: string;
  businessId: string;
  businessName?: string;
  business?: {
    id: string;
    businessName: string;
    name?: string;
  };
  createdAt?: string;
  updatedAt?: string;
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
}

export interface IUpdateVoucherRequest {
  name?: string;
  minimumPrice?: number;
  offPrice?: string;
  requestedBy?: string;
  code?: string;
  expiresAt?: string;
  isUsed?: boolean;
  isActive?: boolean;
  businessId?: string;
}

export interface IQueryVoucherParams {
  search?: string;
  businessId?: string;
}

// Aliases for backwards compatibility
export type VoucherItem = IVoucher;
export type CreateVoucherDto = ICreateVoucherRequest;
export type UpdateVoucherDto = IUpdateVoucherRequest;
