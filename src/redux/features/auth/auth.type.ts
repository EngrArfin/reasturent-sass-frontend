// src/redux/features/auth/auth.type.ts
export type Role =
  | "super_admin"
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SUPERVISOR"
  | "MANAGER"
  | "SERVER"
  | "KITCHEN"
  | "CASHIER"
  | string;

export type User = {
  id: string;
  email: string;
  name?: string;
  role: string;
  businessId?: string | null;
  tenantId?: string | null;
  status?: string;
  avatar?: string | null;
  isActive?: boolean;
  isApproved?: boolean;
  hasPin?: boolean;
  createdAt?: string;
  updatedAt?: string;
  business?: any;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  status: string;
  createdAt: string;
};

// Updated to match Swagger: uses pin instead of password
export type LoginRequest = {
  email: string;
  pin: string;
};

// Matches Swagger response structure: { access_token, user: { id, name, email, role, businessId, ... } }
export type LoginResponse = {
  access_token: string;
  accessToken?: string; // compatibility fallback
  user: {
    id: string;
    name?: string;
    email: string;
    role: string;
    businessId?: string | null;
    avatar?: string | null;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    business?: any;
    status?: string;
    isApproved?: boolean;
    hasPin?: boolean;
    sub?: string;
    tenantId?: string;
  };
};

export type SignupRequest = {
  email: string;
  password: string;
  name: string;
};

export type SignupResponse = {
  accessToken: string;
  admin: AdminUser;
};

export type AuthError = {
  data?: {
    message?: string;
    error?: string;
  };
  error?: string;
  status?: number;
};

export type PinLoginRequest = {
  pin: string;
  tenantId: string;
};

export type PinLoginResponse = {
  accessToken: string;
  user: {
    sub: string;
    name: string;
    tenantId: string;
    role: string;
  };
};

