import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MerchantCustomerState {
  searchQuery: string;
  selectedOrderFilter: string;
  selectedStatusFilter: string;
}

const initialState: MerchantCustomerState = {
  searchQuery: "",
  selectedOrderFilter: "",
  selectedStatusFilter: "",
};

const merchantCustomerSlice = createSlice({
  name: "merchantCustomer",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedOrderFilter: (state, action: PayloadAction<string>) => {
      state.selectedOrderFilter = action.payload;
    },
    setSelectedStatusFilter: (state, action: PayloadAction<string>) => {
      state.selectedStatusFilter = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.selectedOrderFilter = "";
      state.selectedStatusFilter = "";
    },
  },
});

export const {
  setSearchQuery,
  setSelectedOrderFilter,
  setSelectedStatusFilter,
  resetFilters,
} = merchantCustomerSlice.actions;

export default merchantCustomerSlice.reducer;
