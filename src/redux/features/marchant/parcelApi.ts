// src/redux/features/address/addressApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  Address,
  AddressResponse,
  GetMyAddressResponse,
  NewAddressRequest,
//   UpdateAddressRequest,
} from "@/redux/types/marchant.type";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all my addresses
    getMyAddresses: builder.query<Address[], void>({
      query: () => ({
        url: "/parcel/my-parcels",
        method: "GET",
      }),
      transformResponse: (response: GetMyAddressResponse) => response.data.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Address" as const, id })),
              { type: "Parcel", id: "LIST" },
            ]
          : [{ type: "Parcel", id: "LIST" }],
    }),

    // ✅ Create address
    createAddress: builder.mutation<AddressResponse, NewAddressRequest>({
      query: (addressData) => ({
        url: "/parcel/add-parcel",
        method: "POST",
        body: addressData,
      }),
      invalidatesTags: [{ type: "Parcel", id: "LIST" }],
    }),

    // // ✅ Fix update mutation: use addressData.id inside the function
    // updateAddress: builder.mutation<AddressResponse, UpdateAddressRequest>({
    //   query: (addressData) => ({
    //     url: `/address/update-address/${addressData.id}`,
    //     method: "PATCH",
    //     body: addressData,
    //   }),
    //   invalidatesTags: (_result, _error, arg) => [
    //     { type: "Address", id: arg.id },
    //     { type: "Address", id: "LIST" },
    //   ],
    // }),

    // ✅ Delete address
    deleteAddress: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/parcel/delete-parcel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Parcel", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMyAddressesQuery,
  useCreateAddressMutation,
//   useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
