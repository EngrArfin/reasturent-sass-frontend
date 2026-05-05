// src/redux/slices/supportSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { SupportTicket } from "@/redux/types/support";
import { supportApi } from "./supportApi";

interface SupportState {
  tickets: SupportTicket[];
  loading: boolean;
  error: string | null;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

const initialState: SupportState = {
  tickets: [],
  loading: false,
  error: null,
  meta: null,
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      supportApi.endpoints.getSupportTickets.matchPending,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      supportApi.endpoints.getSupportTickets.matchFulfilled,
      (state, action) => {
        state.loading = false;
        state.tickets = action.payload.data.data;
        state.meta = action.payload.data.meta;
      }
    );
    builder.addMatcher(
      supportApi.endpoints.getSupportTickets.matchRejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch support tickets";
      }
    );
  },
});

export default supportSlice.reducer;
