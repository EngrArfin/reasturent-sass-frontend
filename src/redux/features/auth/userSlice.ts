// src/redux/features/auth/userSlice.ts
import { User } from "./auth.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  searchTerm: string;
  roleFilter: string | null;
  users: User[];
  filteredUsers: User[];
}

const initialState: UserState = {
  searchTerm: "",
  roleFilter: null,
  users: [],
  filteredUsers: [],
};

// Helper function to apply filters
function applyFilters(state: UserState) {
  let filtered = state.users;

  // Apply search filter
  if (state.searchTerm) {
    const term = state.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        (user.name || "").toLowerCase().includes(term) ||
        (user.email || "").toLowerCase().includes(term)
    );
  }

  // Apply role filter
  if (state.roleFilter) {
    const filter = state.roleFilter.toLowerCase();
    filtered = filtered.filter(
      (user) => String(user.role || "").toLowerCase() === filter
    );
  }

  state.filteredUsers = filtered;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      applyFilters(state);
    },
    setRoleFilter: (state, action: PayloadAction<string | null>) => {
      state.roleFilter = action.payload;
      applyFilters(state);
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      applyFilters(state);
    },
  },
});

export const { setSearchTerm, setRoleFilter, setUsers } = userSlice.actions;
export default userSlice.reducer;
