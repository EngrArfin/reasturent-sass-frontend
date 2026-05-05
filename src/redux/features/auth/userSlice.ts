// src/redux/features/user/userSlice.ts
import { User } from "@/redux/types/user.type";
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

// Helper function to apply filters
function applyFilters(state: UserState) {
  let filtered = state.users;

  // Apply search filter
  if (state.searchTerm) {
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }

  // Apply role filter
  if (state.roleFilter) {
    filtered = filtered.filter((user) => user.role === state.roleFilter);
  }

  state.filteredUsers = filtered;
}

export const { setSearchTerm, setRoleFilter, setUsers } = userSlice.actions;
export default userSlice.reducer;
