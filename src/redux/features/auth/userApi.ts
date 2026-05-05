// src/redux/features/user/userApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  UsersResponse,
  UserResponse,
  ChangeRolePayload,
  ChangeStatusPayload,
} from "@/redux/types/user.type";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all users
    getAllUsers: build.query<UsersResponse, void>({
      query: () => ({
        url: "/user/all-users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Get my profile
    getMyProfile: build.query<UserResponse, void>({
      query: () => ({
        url: "/user/my-profile-info",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Change user role
    changeUserRole: build.mutation<
      UserResponse,
      { id: string; payload: ChangeRolePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/user/change-role/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

    // Change user status
    changeUserStatus: build.mutation<
      UserResponse,
      { id: string; payload: ChangeStatusPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/user/change-status/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

    // Delete user
    deleteUser: build.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/user/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllUsersQuery,
  useGetMyProfileQuery,
  useChangeUserRoleMutation,
  useChangeUserStatusMutation,
  useDeleteUserMutation,
} = userApi;
