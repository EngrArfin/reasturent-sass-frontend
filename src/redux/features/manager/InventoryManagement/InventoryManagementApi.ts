// src/redux/features/manager/InventoryManagement/InventoryManagementApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  IProduct,
  GetProductsQueryParams,
  GetProductsResponse,
  InventorySummaryResponse,
  GenerateSkuResponse,
  CreateProductPayload,
  UpdateProductPayload,
  DeleteProductResponse,
  BarcodeLabelData,
  AdjustStockPayload,
  AdjustStockResponse,
  ScanProductResponse,
} from "./InventoryManagementType";

export const inventoryManagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // 1. GET /products - Get all inventory products with pagination, search, & status filter
    getProducts: build.query<GetProductsResponse, GetProductsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search.trim());
        if (params?.stockStatus && params.stockStatus !== "ALL") {
          queryParams.append("stockStatus", params.stockStatus);
        }
        if (params?.businessId) queryParams.append("businessId", params.businessId);

        const qs = queryParams.toString();
        return {
          url: `/products${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: any): GetProductsResponse => {
        if (response?.items && Array.isArray(response.items)) {
          return response;
        }
        if (Array.isArray(response?.data?.items)) {
          return response.data;
        }
        if (Array.isArray(response?.data)) {
          return {
            items: response.data,
            total: response.data.length,
            page: 1,
            limit: response.data.length,
            totalPages: 1,
          };
        }
        if (Array.isArray(response)) {
          return {
            items: response,
            total: response.length,
            page: 1,
            limit: response.length,
            totalPages: 1,
          };
        }
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Products" as const, id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // 2. GET /products/summary - Get inventory summary KPIs
    getInventorySummary: build.query<
      InventorySummaryResponse,
      { businessId?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.businessId) queryParams.append("businessId", params.businessId);
        const qs = queryParams.toString();
        return {
          url: `/products/summary${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: any): InventorySummaryResponse => {
        return response?.data || response || {
          totalProducts: 0,
          inStockCount: 0,
          lowStockCount: 0,
          outOfStockCount: 0,
          totalInventoryValue: 0,
          currency: "USD",
        };
      },
      providesTags: ["InventorySummary"],
    }),

    // 3. GET /products/generate-sku - Auto-generate unique Barcode / SKU
    generateSku: build.query<GenerateSkuResponse, { businessId?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.businessId) queryParams.append("businessId", params.businessId);
        const qs = queryParams.toString();
        return {
          url: `/products/generate-sku${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: any): GenerateSkuResponse => {
        return response?.data || response;
      },
    }),

    // 4. GET /products/{id} - Get single product details
    getProductById: build.query<IProduct, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any): IProduct => response?.data || response,
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),

    // 5. POST /products - Add new product
    createProduct: build.mutation<IProduct, CreateProductPayload>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Products", id: "LIST" },
        "InventorySummary",
      ],
    }),

    // 6. PATCH /products/{id} - Update product details
    updateProduct: build.mutation<
      IProduct,
      { id: string; body: UpdateProductPayload }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
        "InventorySummary",
      ],
    }),

    // 7. DELETE /products/{id} - Delete product
    deleteProduct: build.mutation<DeleteProductResponse, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Products", id: "LIST" },
        "InventorySummary",
      ],
    }),

    // 8. GET /products/{id}/barcode-label - Get barcode label data for printing
    getBarcodeLabel: build.query<BarcodeLabelData, string>({
      query: (id) => ({
        url: `/products/${id}/barcode-label`,
        method: "GET",
      }),
      transformResponse: (response: any): BarcodeLabelData => response?.data || response,
    }),

    // 9. PATCH /products/{id}/stock - Adjust product stock level (SET, ADD, SUBTRACT)
    adjustProductStock: build.mutation<
      AdjustStockResponse,
      { id: string; body: AdjustStockPayload }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}/stock`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
        "InventorySummary",
      ],
    }),

    // 10. GET /products/scan - Barcode & QR lookup (Query)
    scanProductQuery: build.query<
      ScanProductResponse,
      { code: string; businessId?: string }
    >({
      query: ({ code, businessId }) => {
        const queryParams = new URLSearchParams();
        queryParams.append("code", code);
        if (businessId) queryParams.append("businessId", businessId);
        return {
          url: `/products/scan?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: any): ScanProductResponse => response?.data || response,
    }),

    // 11. POST /products/scan - Barcode & QR lookup (POST body)
    scanProductPost: build.mutation<
      ScanProductResponse,
      { code: string; businessId?: string }
    >({
      query: (body) => ({
        url: "/products/scan",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetInventorySummaryQuery,
  useGenerateSkuQuery,
  useLazyGenerateSkuQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetBarcodeLabelQuery,
  useLazyGetBarcodeLabelQuery,
  useAdjustProductStockMutation,
  useScanProductQueryQuery,
  useLazyScanProductQueryQuery,
  useScanProductPostMutation,
} = inventoryManagementApi;
