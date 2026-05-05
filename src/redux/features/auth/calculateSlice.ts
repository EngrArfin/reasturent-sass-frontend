// src/redux/features/calculate/calculateSlice.ts
import { CalculateState } from "@/redux/types/calculateTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calculateApi } from "./calculateApi";

const initialState: CalculateState = {
  calculatedPrice: null,
  isLoading: false,
  error: null,
};

const calculateSlice = createSlice({
  name: "calculate",
  initialState,
  reducers: {
    resetCalculation: (state) => {
      state.calculatedPrice = null;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      calculateApi.endpoints.calculateParcelPrice.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      calculateApi.endpoints.calculateParcelPrice.matchFulfilled,
      (state, action) => {
        state.isLoading = false;
        state.calculatedPrice = action.payload.data.totalPrice;
      }
    );
    builder.addMatcher(
      calculateApi.endpoints.calculateParcelPrice.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to calculate price";
      }
    );
  },
});

export const { resetCalculation, setLoading, setError } =
  calculateSlice.actions;
export default calculateSlice.reducer;
