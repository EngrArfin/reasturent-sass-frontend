// src/redux/features/notification/notificationSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface NotificationState {
  isPanelOpen: boolean;
}

const initialState: NotificationState = {
  isPanelOpen: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    openNotificationPanel: (state) => {
      state.isPanelOpen = true;
    },
    closeNotificationPanel: (state) => {
      state.isPanelOpen = false;
    },
    toggleNotificationPanel: (state) => {
      state.isPanelOpen = !state.isPanelOpen;
    },
  },
});

export const {
  openNotificationPanel,
  closeNotificationPanel,
  toggleNotificationPanel,
} = notificationSlice.actions;

export default notificationSlice.reducer;
