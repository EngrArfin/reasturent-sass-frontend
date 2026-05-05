// src/redux/features/address/addressSlice.ts
import { Address } from "@/redux/types/marchant.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddressState {
  addresses: Address[];
}

const initialState: AddressState = {
  addresses: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      state.addresses.push(action.payload);
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      // Payload is the id of the address to remove
      state.addresses = state.addresses.filter(address => address.id !== action.payload);
    },
    clearAddresses: (state) => {
      state.addresses = [];
    },
  },
});

export const { setAddresses, addAddress, removeAddress, clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;
