import { baseApi } from "@/redux/hooks/baseApi";
import { CustomersResponse } from "@/redux/types/customer";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCustomers: builder.query<CustomersResponse, void>({
      query: () => ({
        url: "/customer",
        method: "GET",
      }),
      providesTags: ["Customers"],
      transformResponse: (response: CustomersResponse) => response,
    }),
  }),
});

export const { useGetMyCustomersQuery } = customerApi;
