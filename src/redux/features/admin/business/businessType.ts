export interface IBusinessUser {
  id: string;
  name: string;
  email: string;
  role: string;
  businessId?: string;
  password?: string;
  pin?: string;
  avatar?: string | null;
  isActive: boolean;
  status?: string;
  approvalStatus?: string;
  isApproved?: boolean;
  department?: string;
  hasPin?: boolean;
  accessPin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IBusiness {
  id: string;
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  subscriptionFee: string;
  lastSync: string;
  allowedRoles: string[];
  isActive: boolean;
  settings?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  subscriptionPlanId?: string | null;
  subscriptionPlan?: any | null;
  users?: IBusinessUser[];
  vouchers?: any[];
}

export interface ICreateBusinessRequest {
  businessName: string;
  subscriptionFee?: string;
  supervisorEmail: string;
  supervisorPin: string;
  allowedRoles: string[];
  phone?: string;
  address?: string;
}

export interface ICreateBusinessResponse {
  message: string;
  business: IBusiness;
  user: IBusinessUser;
  supervisor: IBusinessUser;
}

export interface IUpdateBusinessRequest {
  businessName?: string;
  subscriptionFee?: string;
  supervisorEmail?: string;
  supervisorPin?: string;
  allowedRoles?: string[];
  phone?: string;
  address?: string;
  isActive?: boolean;
}

export interface ICreateBusinessUserRequest {
  name: string;
  role: string;
  pin: string;
  email: string;
  password?: string;
  avatar?: string;
  businessId: string;
}

export interface ICreateBusinessUserResponse extends IBusinessUser {}
