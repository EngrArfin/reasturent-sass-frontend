import { baseApi } from "@/redux/hooks/baseApi";
import {
  IBusiness,
  ICreateBusinessRequest,
  ICreateBusinessResponse,
  IUpdateBusinessRequest,
  ICreateBusinessUserRequest,
  ICreateBusinessUserResponse,
} from "./businessType";

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get All Businesses
    getBusinesses: builder.query<IBusiness[], void>({
      query: () => ({
        url: "/businesses",
        method: "GET",
      }),
      providesTags: ["Business"],
    }),

    // 2. Get Business by ID
    getBusinessById: builder.query<IBusiness, string>({
      query: (id) => ({
        url: `/businesses/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Business", id }],
    }),

    // 3. Register New Business Tenant & Supervisor (Owner)
    createBusiness: builder.mutation<ICreateBusinessResponse, ICreateBusinessRequest>({
      query: (payload) => ({
        url: "/businesses",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Business"],
    }),

    // 4. Update Business
    updateBusiness: builder.mutation<IBusiness, { id: string; payload: IUpdateBusinessRequest }>({
      query: ({ id, payload }) => ({
        url: `/businesses/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => ["Business", { type: "Business", id }],
    }),

    // 5. Delete Business
    deleteBusiness: builder.mutation<IBusiness, string>({
      query: (id) => ({
        url: `/businesses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Business"],
    }),

    // 6. Create New Employee / User for Business
    createBusinessUser: builder.mutation<ICreateBusinessUserResponse, ICreateBusinessUserRequest>({
      query: (payload) => ({
        url: "/users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Business", "User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBusinessesQuery,
  useGetBusinessByIdQuery,
  useCreateBusinessMutation,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
  useCreateBusinessUserMutation,
} = businessApi;
