import { baseApi } from "@/redux/hooks/baseApi";
import {
  ISubscriptionPlan,
  ICreateSubscriptionPlanRequest,
  IUpdateSubscriptionPlanRequest,
} from "./subscriptionPlanType";

export * from "./subscriptionPlanType";

export const subscriptionPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get All Subscription Plans
    getSubscriptionPlans: builder.query<ISubscriptionPlan[], void>({
      query: () => ({
        url: "/subscription-plans",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response || [],
      providesTags: ["SubscriptionPlans"],
    }),

    // 2. Get Subscription Plan by ID
    getSubscriptionPlanById: builder.query<ISubscriptionPlan, string>({
      query: (id) => ({
        url: `/subscription-plans/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (_result, _error, id) => [{ type: "SubscriptionPlans", id }],
    }),

    // 3. Create Subscription Plan (SUPER_ADMIN)
    createSubscriptionPlan: builder.mutation<ISubscriptionPlan, ICreateSubscriptionPlanRequest>({
      query: (body) => ({
        url: "/subscription-plans",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubscriptionPlans"],
    }),

    // 4. Update Subscription Plan (SUPER_ADMIN)
    updateSubscriptionPlan: builder.mutation<
      ISubscriptionPlan,
      { id: string; data: IUpdateSubscriptionPlanRequest }
    >({
      query: ({ id, data }) => ({
        url: `/subscription-plans/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "SubscriptionPlans",
        { type: "SubscriptionPlans", id },
      ],
    }),

    // 5. Delete Subscription Plan (SUPER_ADMIN)
    deleteSubscriptionPlan: builder.mutation<ISubscriptionPlan | { success: boolean }, string>({
      query: (id) => ({
        url: `/subscription-plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubscriptionPlans"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSubscriptionPlansQuery,
  useGetSubscriptionPlanByIdQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
} = subscriptionPlanApi;
