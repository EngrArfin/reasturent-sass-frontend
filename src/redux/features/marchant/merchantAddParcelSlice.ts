// src/redux/slices/merchantAddParcelSlice.ts
import { Parcel } from "@/redux/types/merchent/merchantAddParcelType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ParcelState {
  parcels: Parcel[];
  selectedParcel: Parcel | null;
  loading: boolean;
  error: string | null;
  cardData: {
    totalPending: number;
    todayPending: number;
    totalDelivered: number;
    todayDelivered: number;
  };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ParcelState = {
  parcels: [],
  selectedParcel: null,
  loading: false,
  error: null,
  cardData: {
    totalPending: 0,
    todayPending: 0,
    totalDelivered: 0,
    todayDelivered: 0,
  },
  meta: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};

const merchantAddParcelSlice = createSlice({
  name: "merchantParcels",
  initialState,
  reducers: {
    setParcels: (state, action: PayloadAction<Parcel[]>) => {
      state.parcels = action.payload;
    },
    setSelectedParcel: (state, action: PayloadAction<Parcel | null>) => {
      state.selectedParcel = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateParcelInState: (state, action: PayloadAction<Parcel>) => {
      const index = state.parcels.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.parcels[index] = action.payload;
      }
      if (state.selectedParcel?.id === action.payload.id) {
        state.selectedParcel = action.payload;
      }
    },
    removeParcelFromState: (state, action: PayloadAction<string>) => {
      state.parcels = state.parcels.filter((p) => p.id !== action.payload);
    },
    setParcelMetaData: (state, action: PayloadAction<ParcelState['meta']>) => {
      state.meta = action.payload;
    },
    setParcelCardData: (state, action: PayloadAction<ParcelState['cardData']>) => {
      state.cardData = action.payload;
    },
  },
});

export const {
  setParcels,
  setSelectedParcel,
  setLoading,
  setError,
  updateParcelInState,
  removeParcelFromState,
  setParcelMetaData,
  setParcelCardData,
} = merchantAddParcelSlice.actions;

export default merchantAddParcelSlice.reducer;