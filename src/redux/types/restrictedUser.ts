// src/redux/types/restrictedUser.ts
export interface RestrictedUser {
  id: string;
  marchentId: string;
  email: string;
  role: string;
  placeOrders: boolean;
  accessSavedAddress: boolean;
  useDefaultAddress: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface RestrictedUserResponse {
  success: boolean;
  message: string;
  data: RestrictedUser;
}

export interface RestrictedUsersListResponse {
  success: boolean;
  message: string;
  data: {
    data: RestrictedUser[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CreateRestrictedUserPayload {
  email: string;
  role: string;
  placeOrders: boolean;
  accessSavedAddress: boolean;
  useDefaultAddress: boolean;
}

export interface UpdateRestrictedUserPayload
  extends Partial<CreateRestrictedUserPayload> {
  id: string;
}

// // src/redux/types/restrictedUser.ts
// export interface RestrictedUser {
//   id: string;
//   marchentId: string;
//   email: string;
//   role: string;
//   placeOrders: boolean;
//   accessSavedAddress: boolean;
//   useDefaultAddress: boolean;
//   createdAt: string;
//   updatedAt: string;
//   isDeleted: boolean;
// }

// export interface RestrictedUserResponse {
//   success: boolean;
//   message: string;
//   data: RestrictedUser;
// }

// export interface RestrictedUsersListResponse {
//   success: boolean;
//   message: string;
//   data: {
//     data: RestrictedUser[];
//     meta: {
//       page: number;
//       limit: number;
//       total: number;
//       totalPages: number;
//     };
//   };
// }

// export interface CreateRestrictedUserPayload {
//   email: string;
//   role: string;
//   placeOrders: boolean;
//   accessSavedAddress: boolean;
//   useDefaultAddress: boolean;
// }

// export interface UpdateRestrictedUserPayload
//   extends Partial<CreateRestrictedUserPayload> {
//   id: string;
// }

// // src/types/restrictedUser.ts
// export interface RestrictedUser {
//   id: string;
//   marchentId: string;
//   email: string;
//   role: string;
//   placeOrders: boolean;
//   accessSavedAddress: boolean;
//   useDefaultAddress: boolean;
//   createdAt: string;
//   updatedAt: string;
//   isDeleted: boolean;
// }

// export interface RestrictedUserResponse {
//   success: boolean;
//   message: string;
//   data: RestrictedUser;
// }

// export interface RestrictedUsersListResponse {
//   success: boolean;
//   message: string;
//   data: {
//     data: RestrictedUser[];
//     meta: {
//       page: number;
//       limit: number;
//       total: number;
//       totalPages: number;
//     };
//   };
// }

// export interface CreateRestrictedUserPayload {
//   email: string;
//   role: string;
//   placeOrders: boolean;
//   accessSavedAddress: boolean;
//   useDefaultAddress: boolean;
// }

// export interface UpdateRestrictedUserPayload
//   extends Partial<CreateRestrictedUserPayload> {
//   id: string;
// }
