import { baseApi } from "@/redux/hooks/baseApi";
import {
  IVoucher,
  ICreateVoucherRequest,
  IUpdateVoucherRequest,
  IQueryVoucherParams,
} from "./voucherType";

export * from "./voucherType";

export const voucherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get All Vouchers & Discounts
    getAllVouchers: builder.query<IVoucher[], IQueryVoucherParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("search", params.search);
        if (params?.businessId) queryParams.append("businessId", params.businessId);
        const qs = queryParams.toString();
        return {
          url: `/vouchers${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => response?.data || response || [],
      providesTags: ["Vouchers"],
    }),

    // 2. Get Voucher by ID
    getVoucherById: builder.query<IVoucher, string>({
      query: (id) => ({
        url: `/vouchers/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (_result, _error, id) => [{ type: "Vouchers", id }],
    }),

    // 3. Create Voucher
    createVoucher: builder.mutation<IVoucher, ICreateVoucherRequest>({
      query: (body) => ({
        url: "/vouchers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vouchers"],
    }),

    // 4. Update Voucher
    updateVoucher: builder.mutation<IVoucher, { id: string; data: IUpdateVoucherRequest }>({
      query: ({ id, data }) => ({
        url: `/vouchers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ["Vouchers", { type: "Vouchers", id }],
    }),

    // 5. Delete Voucher
    deleteVoucher: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/vouchers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vouchers"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllVouchersQuery,
  useGetVoucherByIdQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
} = voucherApi;
