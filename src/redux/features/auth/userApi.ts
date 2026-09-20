import { baseApi } from "@/redux/hooks/baseApi";
import {
  UsersResponse,
  UserResponse,
  ChangeRolePayload,
  ChangeStatusPayload,
} from "./auth.type";
import {
  IUser,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  UpdateApprovalStatusPayload,
  GetEmployeesQueryParams,
  GetApprovalsQueryParams,
  ApprovalsResponse,
  DeleteEmployeeResponse,
  ApprovalActionResponse,
} from "./userType";

// Re-export for backward compatibility
export type ApprovalRequestItem = IUser;
export type { ApprovalsResponse } from "./userType";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // 1. GET /users - Get all employees (scoped or filtered)
    getEmployees: build.query<IUser[], GetEmployeesQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.businessId) queryParams.append("businessId", params.businessId);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.role) queryParams.append("role", params.role);
        const qs = queryParams.toString();
        return {
          url: `/users${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        return response || [];
      },
      providesTags: ["User"],
    }),

    // 2. GET /users/{id} - Get employee by ID
    getEmployeeById: build.query<IUser, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // 3. POST /users - Add new employee profile
    createEmployee: build.mutation<IUser, CreateEmployeePayload>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Approvals"],
    }),

    // 4. PATCH /users/{id} - Edit employee profile
    updateEmployee: build.mutation<
      IUser,
      { id: string; body: UpdateEmployeePayload }
    >({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "User",
        "Approvals",
        { type: "User", id },
      ],
    }),

    // 5. DELETE /users/{id} - Delete employee profile
    deleteEmployee: build.mutation<DeleteEmployeeResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Approvals"],
    }),

    // 6. GET /users/approvals - Get staff approval requests & KPI metrics
    getStaffApprovals: build.query<
      ApprovalsResponse,
      GetApprovalsQueryParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.businessId) queryParams.append("businessId", params.businessId);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.status) queryParams.append("status", params.status);
        const qs = queryParams.toString();
        return {
          url: `/users/approvals${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["User", "Approvals"],
    }),

    // 7. PATCH /users/{id}/approval - Approve or Block staff/manager access
    updateApprovalStatus: build.mutation<
      ApprovalActionResponse,
      { id: string; payload: UpdateApprovalStatusPayload } | { id: string; status: string }
    >({
      query: ({ id, ...rest }) => {
        const body = "payload" in rest ? rest.payload : { status: rest.status };
        return {
          url: `/users/${id}/approval`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["User", "Approvals"],
    }),

    // 8. POST /users/{id}/change-pin - Update quick-login PIN
    changeUserPin: build.mutation<
      { message: string; userId: string },
      { id: string; pin: string }
    >({
      query: ({ id, pin }) => ({
        url: `/users/${id}/change-pin`,
        method: "POST",
        body: { pin },
      }),
      invalidatesTags: ["User", "Approvals"],
    }),

    // --- Legacy / Compatibility Endpoints ---
    getAllUsers: build.query<UsersResponse, void>({
      query: () => ({
        url: "/user/all-users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getMyProfile: build.query<UserResponse, void>({
      query: () => ({
        url: "/user/my-profile-info",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

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

    changeUserStatus: build.mutation<
      UserResponse,
      { id: string; payload: ChangeStatusPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/user/change-status/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User", "Approvals"],
    }),

    deleteUser: build.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Approvals"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetStaffApprovalsQuery,
  useUpdateApprovalStatusMutation,
  useChangeUserPinMutation,
  useGetAllUsersQuery,
  useGetMyProfileQuery,
  useChangeUserRoleMutation,
  useChangeUserStatusMutation,
  useDeleteUserMutation,
} = userApi;
