// src/redux/api/merchantAddParcelApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import { AddParcelPayload, AddParcelResponse, DeleteParcelResponse, ParcelListResponse, SingleParcelResponse } from "@/redux/types/merchent/merchantAddParcelType";

// Define tag types for better type safety
const parcelTagTypes = ['MerchantParcel', 'MerchantParcels'] as const;

export const merchantAddParcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add new parcel
    addParcel: builder.mutation<AddParcelResponse, AddParcelPayload>({
      query: (data) => ({
        url: "/parcel/add-parcel",
        method: "POST",
        body: data,
      }),
      invalidatesTags: parcelTagTypes,
    }),

    // Get all parcels
    getParcels: builder.query<ParcelListResponse, void>({
      query: () => ({
        url: "/parcel/my-parcels",
        method: "GET",
      }),
      providesTags: (result) => {
        // Default fallback
        const defaultTags = [{ type: 'MerchantParcels' as const, id: 'LIST' }];
        
        if (!result?.data?.data) return defaultTags;
        
        return [
          ...result.data.data.map(({ id }) => ({ 
            type: 'MerchantParcel' as const, 
            id 
          })),
          ...defaultTags,
        ];
      },
    }),

    // Get single parcel
    getSingleParcel: builder.query<SingleParcelResponse, string>({
      query: (id) => ({
        url: `/parcel/get-single/${id}`,
        method: "GET",
      }),
      providesTags: (result, _error, id) => 
        result ? [{ type: 'MerchantParcel', id }] : [],
    }),

    // Update parcel
    updateParcel: builder.mutation<
      SingleParcelResponse,
      { id: string; data: Partial<AddParcelPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/parcel/update-parcel/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'MerchantParcel', id },
        { type: 'MerchantParcels', id: 'LIST' },
      ],
    }),

    // Delete parcel
    deleteParcel: builder.mutation<DeleteParcelResponse, string>({
      query: (id) => ({
        url: `/parcel/delete-parcel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'MerchantParcel', id },
        { type: 'MerchantParcels', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddParcelMutation,
  useGetParcelsQuery,
  useGetSingleParcelQuery,
  useUpdateParcelMutation,
  useDeleteParcelMutation,
} = merchantAddParcelApi;