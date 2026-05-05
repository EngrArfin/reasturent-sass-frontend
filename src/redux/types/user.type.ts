// // src/redux/features/user/userTypes.ts
// export interface UserProfileData {
//   id: string;
//   name: string;
//   businessName?: string;
//   address_Pickup_Location?: string;
//   phone: string;
//   email: string;
//   role: string;
//   createdAt: string;
// }

// export interface UserProfileResponse {
//   success: boolean;
//   message: string;
//   data: UserProfileData;
// }

// src/redux/types/user.type.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "marchant"; // Note: Your API has "marchant" (typo?)
  status: "ACTIVE" | "BLOCKED";
  businessName?: string;
  address_Pickup_Location?: string;
  phone?: string;
  createdAt?: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    data: User[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface ChangeRolePayload {
  role: "admin" | "marchant";
}

export interface ChangeStatusPayload {
  status: "ACTIVE" | "BLOCKED";
}
