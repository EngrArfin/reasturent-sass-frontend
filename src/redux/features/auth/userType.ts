// src/redux/features/auth/userType.ts

export type EmployeeRole =
    | "supervisor"
    | "manager"
    | "server"
    | "kitchen"
    | "cashier"
    | "Supervisor"
    | "Manager"
    | "Server"
    | "Kitchen"
    | "Cashier"
    | string;

export type ApprovalStatus = "APPROVED" | "PENDING" | "BLOCKED" | "REJECTED" | string;

export interface IUserBusiness {
    id: string;
    businessName?: string;
    name?: string;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    role: EmployeeRole;
    systemRole?: string;
    businessId?: string;
    avatar?: string | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    status?: ApprovalStatus;
    approvalStatus?: string;
    isApproved?: boolean;
    department?: string;
    hasPin?: boolean;
    pin?: string;
    accessPin?: string;
    requestedAt?: string;
    business?: IUserBusiness;
}

// Alias for employee profile
export type IEmployee = IUser;

export interface CreateEmployeePayload {
    name: string;
    role: string;
    pin: string;
    email?: string;
    password?: string;
    avatar?: string;
    businessId?: string;
    status?: string;
    isApproved?: boolean;
    isActive?: boolean;
}

export interface UpdateEmployeePayload {
    name?: string;
    role?: string;
    pin?: string;
    email?: string;
    password?: string;
    avatar?: string;
    isActive?: boolean;
    businessId?: string;
}

export interface UpdateApprovalStatusPayload {
    status: "APPROVED" | "BLOCKED" | "PENDING" | string;
    isActive?: boolean;
    isApproved?: boolean;
}

export interface GetEmployeesQueryParams {
    businessId?: string;
    search?: string;
    role?: string;
}

export interface GetApprovalsQueryParams {
    businessId?: string;
    search?: string;
    status?: string;
}

export interface ApprovalsMetrics {
    totalCount: number;
    approvedCount: number;
    pendingCount: number;
    blockedCount: number;
}

export interface ApprovalsResponse {
    metrics: ApprovalsMetrics;
    requests: IUser[];
    employees: IUser[];
}

export interface DeleteEmployeeResponse {
    message: string;
    id: string;
    name?: string;
}

export interface ApprovalActionResponse {
    message: string;
    user: IUser;
    status: string;
}
