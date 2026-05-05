// src/redux/features/calculate/calculateApi.ts
import {
  CalculateParcelRequest,
  CalculateParcelResponse,
} from "@/redux/types/calculateTypes";
import { baseApi } from "../../hooks/baseApi";

export const calculateApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    calculateParcelPrice: build.mutation<
      CalculateParcelResponse,
      CalculateParcelRequest
    >({
      query: (data) => ({
        url: "/parcel/calculate-parcel-price",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Calculate"],
    }),
  }),
  overrideExisting: false,
});

export const { useCalculateParcelPriceMutation } = calculateApi;
