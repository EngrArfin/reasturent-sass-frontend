// src/redux/features/manager/ManageFood/manageFoodApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  IApiResponse,
  IApiDeleteResponse,
  ITable,
  ITableSummary,
  IGetTablesResponse,
  IGetTablesParams,
  ICreateTablePayload,
  IUpdateTablePayload,
  IMenuItem,
  IGetMenuItemsResponse,
  IGetMenuItemsParams,
  ICreateMenuItemPayload,
  IUpdateMenuItemPayload,
  IOrder,
  IOrderSummary,
  IGetOrdersResponse,
  IGetOrdersParams,
  ICreateOrderPayload,
  IUpdateOrderPayload,
  IUpdateOrderStatusPayload,
} from "./manageFoodType";

export const manageFoodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================================================
    // TABLES ENDPOINTS
    // =========================================================================
    getTables: builder.query<IGetTablesResponse, IGetTablesParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("search", params.search);
        if (params?.status && params.status !== "ALL") queryParams.append("status", params.status);
        if (params?.section && params.section !== "ALL") queryParams.append("section", params.section);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.businessId) queryParams.append("businessId", params.businessId);

        const queryString = queryParams.toString();
        return {
          url: `/tables${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Tables"],
    }),

    getTableSummary: builder.query<IApiResponse<ITableSummary>, { businessId?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.businessId) queryParams.append("businessId", params.businessId);
        const queryString = queryParams.toString();
        return {
          url: `/tables/summary${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Tables"],
    }),

    getTableById: builder.query<IApiResponse<ITable>, string>({
      query: (id) => ({
        url: `/tables/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Tables", id }],
    }),

    createTable: builder.mutation<IApiResponse<ITable>, ICreateTablePayload>({
      query: (body) => ({
        url: "/tables",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tables"],
    }),

    updateTable: builder.mutation<IApiResponse<ITable>, IUpdateTablePayload>({
      query: ({ id, ...body }) => ({
        url: `/tables/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tables"],
    }),

    deleteTable: builder.mutation<IApiDeleteResponse, string>({
      query: (id) => ({
        url: `/tables/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tables"],
    }),

    // =========================================================================
    // MENU DISHES / CATALOG ENDPOINTS
    // =========================================================================
    getMenuItems: builder.query<IGetMenuItemsResponse, IGetMenuItemsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("search", params.search);
        if (params?.category && params.category !== "ALL") queryParams.append("category", params.category);
        if (params?.isAvailable !== undefined) queryParams.append("isAvailable", String(params.isAvailable));
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.businessId) queryParams.append("businessId", params.businessId);

        const queryString = queryParams.toString();
        return {
          url: `/menu-items${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["MenuItems"],
    }),

    getMenuCategories: builder.query<IApiResponse<Record<string, number>>, { businessId?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.businessId) queryParams.append("businessId", params.businessId);
        const queryString = queryParams.toString();
        return {
          url: `/menu-items/categories${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["MenuItems"],
    }),

    getMenuItemById: builder.query<IApiResponse<IMenuItem>, string>({
      query: (id) => ({
        url: `/menu-items/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "MenuItems", id }],
    }),

    createMenuItem: builder.mutation<IApiResponse<IMenuItem>, ICreateMenuItemPayload>({
      query: (body) => ({
        url: "/menu-items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MenuItems"],
    }),

    updateMenuItem: builder.mutation<IApiResponse<IMenuItem>, IUpdateMenuItemPayload>({
      query: ({ id, ...body }) => ({
        url: `/menu-items/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["MenuItems"],
    }),

    deleteMenuItem: builder.mutation<IApiDeleteResponse, string>({
      query: (id) => ({
        url: `/menu-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MenuItems"],
    }),

    toggleMenuItemAvailability: builder.mutation<IApiResponse<IMenuItem>, string>({
      query: (id) => ({
        url: `/menu-items/${id}/toggle-availability`,
        method: "PATCH",
      }),
      invalidatesTags: ["MenuItems"],
    }),

    // =========================================================================
    // ACTIVE ORDERS & LIFECYCLE ENDPOINTS
    // =========================================================================
    getOrders: builder.query<IGetOrdersResponse, IGetOrdersParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("search", params.search);
        if (params?.status && params.status !== "ALL") queryParams.append("status", params.status);
        if (params?.tableId) queryParams.append("tableId", params.tableId);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.businessId) queryParams.append("businessId", params.businessId);

        const queryString = queryParams.toString();
        return {
          url: `/orders${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Orders", "Tables"],
    }),

    getOrderSummary: builder.query<IApiResponse<IOrderSummary>, { businessId?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.businessId) queryParams.append("businessId", params.businessId);
        const queryString = queryParams.toString();
        return {
          url: `/orders/summary${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),

    getOrderById: builder.query<IApiResponse<IOrder>, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Orders", id }],
    }),

    createOrder: builder.mutation<IApiResponse<IOrder>, ICreateOrderPayload>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders", "Tables"],
    }),

    updateOrder: builder.mutation<IApiResponse<IOrder>, IUpdateOrderPayload>({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Orders", "Tables"],
    }),

    deleteOrder: builder.mutation<IApiDeleteResponse, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders", "Tables"],
    }),

    updateOrderStatus: builder.mutation<IApiResponse<IOrder>, IUpdateOrderStatusPayload>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders", "Tables"],
    }),
  }),
});

export const {
  // Tables Hooks
  useGetTablesQuery,
  useGetTableSummaryQuery,
  useGetTableByIdQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,

  // Menu Items Hooks
  useGetMenuItemsQuery,
  useGetMenuCategoriesQuery,
  useGetMenuItemByIdQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useToggleMenuItemAvailabilityMutation,

  // Orders Hooks
  useGetOrdersQuery,
  useGetOrderSummaryQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
} = manageFoodApi;
