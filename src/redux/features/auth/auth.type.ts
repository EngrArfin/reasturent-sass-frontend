// src/redux/features/auth/auth.type.ts

export enum UserRole {
  super_admin = "super_admin",
  business_admin = "business_admin",
  supervisor = "supervisor",
  manager = "manager",
  cashier = "cashier",
  server = "server",
  kitchen = "kitchen",
}

export type Role =
  | "super_admin"
  | "business_admin"
  | "supervisor"
  | "manager"
  | "cashier"
  | "server"
  | "kitchen"
  | UserRole;

export type User = {
  id: string;
  email: string;
  name?: string;
  role: Role | string;
  systemRole?: string;
  businessId?: string | null;
  tenantId?: string | null;
  status?: string;
  avatar?: string | null;
  isActive?: boolean;
  isApproved?: boolean;
  hasPin?: boolean;
  pin?: string;
  accessPin?: string;
  department?: string;
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

// Swagger format: uses email & 4-digit PIN for authentication
export type LoginRequest = {
  email: string;
  pin: string;
};

// Swagger response structure: { access_token, user: { id, name, email, role, businessId, ... } }
export type LoginResponse = {
  access_token: string;
  accessToken?: string;
  user: User;
};

export type SignupRequest = {
  email: string;
  password?: string;
  pin?: string;
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
    role: Role | string;
  };
};

export type UserResponse = {
  success?: boolean;
  message?: string;
  data: User;
};

export type UsersResponse = {
  success?: boolean;
  message?: string;
  data: User[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
};

export type ChangeRolePayload = {
  role: Role | string;
};

export type ChangeStatusPayload = {
  status: "ACTIVE" | "INACTIVE" | string;
};
