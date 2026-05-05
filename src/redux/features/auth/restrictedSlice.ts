// src/redux/features/restrictedUser/restrictedSlice.ts
import { RestrictedUser } from "@/redux/types/restrictedUser";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RestrictedState {
  selectedUser: RestrictedUser | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  searchTerm: string;
}

const initialState: RestrictedState = {
  selectedUser: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  searchTerm: "",
};

const restrictedSlice = createSlice({
  name: "restricted",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<RestrictedUser | null>) => {
      state.selectedUser = action.payload;
    },
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },
    openEditModal: (state, action: PayloadAction<RestrictedUser>) => {
      state.isEditModalOpen = true;
      state.selectedUser = action.payload;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedUser = null;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    resetRestrictedState: () => initialState,
  },
});

export const {
  setSelectedUser,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  setSearchTerm,
  resetRestrictedState,
} = restrictedSlice.actions;

export default restrictedSlice.reducer;
