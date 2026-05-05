// src/redux/features/merchant/merchantParcelApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import { MerchantParcelResponse } from "@/redux/types/merchantOrder";

export const merchantParcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMerchantParcels: builder.query<MerchantParcelResponse, void>({
      query: () => ({
        url: "/parcel/my-parcels",
        method: "GET",
      }),
      providesTags: ["MerchantParcels"],
      transformResponse: (response: MerchantParcelResponse) => response,
    }),
  }),
});

export const { useGetMerchantParcelsQuery } = merchantParcelApi;
