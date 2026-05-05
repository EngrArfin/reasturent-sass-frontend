// src/redux/features/restrictedUser/restrictedApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  CreateRestrictedUserPayload,
  RestrictedUserResponse,
  RestrictedUsersListResponse,
  UpdateRestrictedUserPayload,
} from "@/redux/types/restrictedUser";

export const restrictedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRestrictedUsers: builder.query<RestrictedUsersListResponse, void>({
      query: () => `/restricted-user`,
      providesTags: ["RestrictedUser"],
    }),
    getRestrictedUserById: builder.query<RestrictedUserResponse, string>({
      query: (id) => `/restricted-user/${id}`,
      providesTags: (_result, _error, id) => [{ type: "RestrictedUser", id }],
    }),
    createRestrictedUser: builder.mutation<
      RestrictedUserResponse,
      CreateRestrictedUserPayload
    >({
      query: (body) => ({
        url: `/restricted-user/add-restricted-user`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["RestrictedUser"],
    }),
    updateRestrictedUser: builder.mutation<
      RestrictedUserResponse,
      UpdateRestrictedUserPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/restricted-user/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "RestrictedUser", id },
        "RestrictedUser",
      ],
    }),
    deleteRestrictedUser: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/restricted-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RestrictedUser"],
    }),
  }),
});

export const {
  useGetRestrictedUsersQuery,
  useGetRestrictedUserByIdQuery,
  useCreateRestrictedUserMutation,
  useUpdateRestrictedUserMutation,
  useDeleteRestrictedUserMutation,
} = restrictedApi;
