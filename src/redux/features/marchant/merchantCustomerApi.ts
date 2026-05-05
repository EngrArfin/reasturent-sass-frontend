// src/redux/api/merchantCustomer.api.ts
import { baseApi } from "@/redux/hooks/baseApi";
import { AddCustomerPayload, CustomerDetailsResponse, CustomerListResponse } from "@/redux/types/merchent/merchent.customer";

export const merchantCustomerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL CUSTOMERS
    getCustomers: builder.query<CustomerListResponse, void>({
      query: () => ({
        url: "/customer/myself-customers",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data?.data ?
          [
            ...result.data.data.map(({ id }) => ({
              type: "MerchantCustomers" as const,
              id
            })),
            { type: "MerchantCustomers", id: "LIST" },
          ]
          : [{ type: "MerchantCustomers", id: "LIST" }],
    }),

    // GET SINGLE CUSTOMER
    getCustomer: builder.query<CustomerDetailsResponse, string>({
      query: (id) => ({
        url: `/customer/single-customer/${id}`,
        method: "GET",
      }),
      providesTags: (result, _error, id) =>
        result ? [{ type: "MerchantCustomers" as const, id }] : [],
    }),

    // CREATE CUSTOMER
    addCustomer: builder.mutation<CustomerDetailsResponse, AddCustomerPayload>({
      query: (data) => ({
        url: "/customer/add-customer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "MerchantCustomers", id: "LIST" },
        { type: "Customers", id: "LIST" }
      ],
    }),

    // UPDATE CUSTOMER - Modified to match backend expectations
    updateCustomer: builder.mutation<
      CustomerDetailsResponse,
      { id: string; data: Partial<AddCustomerPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/customer/update-customer/${id}`,
        method: "PATCH",
        body: {
          Name: data.Name,
          Email: data.Email,
          Phone: data.Phone,
          ShippingAddress: data.ShippingAddress,
          BillingAddress: data.BillingAddress,
          postalCode: data.postalCode,
          status: data.status
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MerchantCustomers" as const, id },
        { type: "MerchantCustomers", id: "LIST" },
      ],
    }),

    // DELETE CUSTOMER
    deleteCustomer: builder.mutation<{
      success: boolean;
      message: string
    }, string>({
      query: (id) => ({
        url: `/customer/delete-customer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "MerchantCustomers" as const, id },
        { type: "MerchantCustomers", id: "LIST" },
        { type: "Customers", id },
        { type: "Customers", id: "LIST" }
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = merchantCustomerApi;