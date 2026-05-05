// src/redux/features/parcel/parcelApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import { Parcel } from "@/redux/types/parcel";

export const parcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getParcels: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/parcel?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Parcel"],
    }),
    getSingleParcel: builder.query<Parcel, string>({
      query: (id) => ({
        url: `/parcel/get-single/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Parcel", id }],
    }),
    getParcelByTrackingId: builder.query<Parcel, string>({
      query: (trackingId) => ({
        url: `/parcel/my-parcels?trackingId=${trackingId}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetParcelsQuery,
  useGetSingleParcelQuery,
  useGetParcelByTrackingIdQuery,
} = parcelApi;
