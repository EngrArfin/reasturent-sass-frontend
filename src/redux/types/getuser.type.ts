// types.ts
export const statusConfig = {
  ACTIVE: {
    label: "Active",
    bgColor: "bg-[#D3F8DF]",
    textColor: "text-[#084C2E]",
  },
  INACTIVE: {
    label: "Inactive",
    bgColor: "bg-[#FEE4E2]",
    textColor: "text-[#912018]",
  },
} as const;

export const roleConfig = {
  marchant: {
    label: "Merchant",
    bgColor: "bg-[#E0E7FF]",
    textColor: "text-[#3730A3]",
  },
  admin: {
    label: "Admin",
    bgColor: "bg-[#F0FDF4]",
    textColor: "text-[#166534]",
  },
  customer: {
    label: "Customer",
    bgColor: "bg-[#FEF2F2]",
    textColor: "text-[#991B1B]",
  },
} as const;

export type UserStatus = keyof typeof statusConfig;
export type UserRole = keyof typeof roleConfig;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
