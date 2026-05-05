// src/redux/features/contact/contactApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  TContactFormData,
  TContactListResponse,
  TContactResponse,
} from "@/redux/types/contact";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation<TContactResponse, TContactFormData>({
      query: (data) => ({
        url: "/get-in-touch/add-message",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Contact"],
    }),
    getContacts: builder.query<TContactListResponse, void>({
      query: () => "/get-in-touch",
      providesTags: ["Contact"],
    }),
  }),
});

export const { useCreateContactMutation, useGetContactsQuery } = contactApi;
