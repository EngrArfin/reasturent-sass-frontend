import { baseApi } from "@/redux/hooks/baseApi";
import {
  IVoucher,
  ICreateVoucherRequest,
  IUpdateVoucherRequest,
  IDeleteVoucherResponse,
} from "./vouchersDiscountsType";

export * from "./vouchersDiscountsType";

export const vouchersDiscountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get All Vouchers
    getVouchers: builder.query<IVoucher[], void>({
      query: () => ({
        url: "/vouchers",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const list = Array.isArray(response)
          ? response
          : response?.data || response?.vouchers || [];
        return list.map((v: any) => {
          const minPrice = Number(v.minimumPrice ?? v.minPrice ?? 0);
          const percentNum = parseFloat(String(v.offPrice || "0").replace("%", "")) || 0;
          const discountAmt =
            v.amountOff !== undefined
              ? Number(v.amountOff)
              : Number(((minPrice * percentNum) / 100).toFixed(2));
          const finalPr =
            v.finalPrice !== undefined
              ? Number(v.finalPrice)
              : Number(Math.max(0, minPrice - discountAmt).toFixed(2));

          return {
            ...v,
            minPrice,
            minimumPrice: minPrice,
            originalPrice: minPrice,
            discountPercent: percentNum,
            discountAmount: discountAmt,
            finalPrice: finalPr,
            requestedBy: v.requestedBy || "MANAGER",
            requestedByFormatted:
              v.requestedByFormatted || `REQUESTED BY ${v.requestedBy || "MANAGER"}`,
            originalFormatted: v.originalFormatted || `$${minPrice.toFixed(2)}`,
            discountFormatted: v.discountFormatted || `-$${discountAmt.toFixed(2)}`,
            finalFormatted: v.finalFormatted || `$${finalPr.toFixed(2)}`,
          };
        });
      },
      providesTags: ["Vouchers"],
    }),

    // 2. Get Voucher by ID
    getVoucherById: builder.query<IVoucher, string>({
      query: (id) => ({
        url: `/vouchers/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const v = response?.data || response;
        if (!v) return v;
        const minPrice = Number(v.minimumPrice ?? v.minPrice ?? 0);
        const percentNum = parseFloat(String(v.offPrice || "0").replace("%", "")) || 0;
        const discountAmt =
          v.amountOff !== undefined
            ? Number(v.amountOff)
            : Number(((minPrice * percentNum) / 100).toFixed(2));
        const finalPr =
          v.finalPrice !== undefined
            ? Number(v.finalPrice)
            : Number(Math.max(0, minPrice - discountAmt).toFixed(2));

        return {
          ...v,
          minPrice,
          minimumPrice: minPrice,
          originalPrice: minPrice,
          discountPercent: percentNum,
          discountAmount: discountAmt,
          finalPrice: finalPr,
          requestedBy: v.requestedBy || "MANAGER",
          requestedByFormatted:
            v.requestedByFormatted || `REQUESTED BY ${v.requestedBy || "MANAGER"}`,
          originalFormatted: v.originalFormatted || `$${minPrice.toFixed(2)}`,
          discountFormatted: v.discountFormatted || `-$${discountAmt.toFixed(2)}`,
          finalFormatted: v.finalFormatted || `$${finalPr.toFixed(2)}`,
        };
      },
      providesTags: (_result, _error, id) => [{ type: "Vouchers", id }],
    }),

    // 3. Create New Voucher
    createVoucher: builder.mutation<IVoucher, ICreateVoucherRequest>({
      query: (body) => ({
        url: "/vouchers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vouchers"],
    }),

    // 4. Update Voucher
    updateVoucher: builder.mutation<
      IVoucher,
      { id: string; data: IUpdateVoucherRequest }
    >({
      query: ({ id, data }) => ({
        url: `/vouchers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Vouchers", id },
        "Vouchers",
      ],
    }),

    // 5. Delete Voucher
    deleteVoucher: builder.mutation<IDeleteVoucherResponse, string>({
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
  useGetVouchersQuery,
  useGetVoucherByIdQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
} = vouchersDiscountsApi;
