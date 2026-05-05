// src/redux/features/merchant/merchantParcelSlice.ts
import { Parcel } from "@/redux/types/merchantOrder";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MerchantParcelState {
  parcels: Parcel[];
  loading: boolean;
  error: string | null;
}

const initialState: MerchantParcelState = {
  parcels: [],
  loading: false,
  error: null,
};

const merchantParcelSlice = createSlice({
  name: "merchantParcel",
  initialState,
  reducers: {
    setParcels(state, action: PayloadAction<Parcel[]>) {
      state.parcels = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearParcels(state) {
      state.parcels = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setParcels, setLoading, setError, clearParcels } =
  merchantParcelSlice.actions;

export default merchantParcelSlice.reducer;
