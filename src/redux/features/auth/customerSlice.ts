import { Customer, CustomersResponse } from "@/redux/types/customer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerState {
  customers: Customer[];
  total: number;
  active: number;
  inactive: number;
  newCustomers: number;
}

const initialState: CustomerState = {
  customers: [],
  total: 0,
  active: 0,
  inactive: 0,
  newCustomers: 0,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<CustomersResponse["data"]>) => {
      state.customers = action.payload.data;
      state.total = action.payload.totalCustomers;
      state.newCustomers = action.payload.newCustomers;

      // Calculate active/inactive customers based on parcels
      let activeCount = 0;
      let inactiveCount = 0;

      action.payload.data.forEach((customer) => {
        if (customer.AddParcel && customer.AddParcel.length > 0) {
          const hasActiveParcel = customer.AddParcel.some(
            (parcel) =>
              parcel.paymentStatus === "PAID" ||
              parcel.deliveryStatus !== "DELIVERED"
          );
          if (hasActiveParcel) {
            activeCount++;
          } else {
            inactiveCount++;
          }
        } else {
          inactiveCount++;
        }
      });

      state.active = activeCount;
      state.inactive = inactiveCount;
    },
  },
});

export const { setCustomers } = customerSlice.actions;
export default customerSlice.reducer;
