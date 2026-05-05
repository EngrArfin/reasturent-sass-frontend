// src/redux/features/parcel/parcelSlice.ts
import { Parcel } from "@/redux/types/parcel";
import { createSlice } from "@reduxjs/toolkit";

interface ParcelState {
  parcels: Parcel[];
  loading: boolean;
  error: string | null;
}

const initialState: ParcelState = {
  parcels: [],
  loading: false,
  error: null,
};

const parcelSlice = createSlice({
  name: "parcel",
  initialState,
  reducers: {},
});

export default parcelSlice.reducer;
