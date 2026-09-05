// src/redux/features/auth/auth.type.ts
export type Role =
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
  role: Role;
  tenantId?: string;
  status?: string;
  createdAt?: string;
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
  pin: string; // Changed from password to pin
};

// Updated to match Swagger response structure
export type LoginResponse = {
  accessToken: string;
  user: {
    sub: string;
    email: string;
    role: string;
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
