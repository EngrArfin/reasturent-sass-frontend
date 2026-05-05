// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./hooks/baseApi";
import authReducer from "@/redux/features/auth/authSlice";
import userReducer from "@/redux/features/auth/userSlice";
import addressReducer from "@/redux/features/marchant/addressSlice";
import supportReducer from "@/redux/features/auth/supportSlice";
import customerReducer from "@/redux/features/auth/customerSlice";
import parcelReducer from "@/redux/features/auth/parcelSlice";
import merchantOrderReducer from "@/redux/features/auth/merchantOrderSlice";
import restrictedReducer from "@/redux/features/auth/restrictedSlice";
import merchantCustomerReducer from "@/redux/features/marchant/merchantCustomerSlice";
import notificationReducer from "@/redux/features/auth/notificationSlice";
import merchantAddParcelReducer from "@/redux/features/marchant/merchantAddParcelSlice"; // Add this import
import calculateReducer from "@/redux/features/auth/calculateSlice";
import contactReducer from "@/redux/features/auth/contactSlice";

import {
  persistReducer,
  persistStore,
  PERSIST,
  REHYDRATE,
  PAUSE,
  FLUSH,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist config for authentication
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedReducer,
    user: userReducer,
    address: addressReducer,
    customer: customerReducer,
    parcel: parcelReducer,
    support: supportReducer,
    merchantCustomer: merchantCustomerReducer,

    merchantParcels: merchantAddParcelReducer, // Add the parcel reducer

    merchantOrder: merchantOrderReducer,
    restricted: restrictedReducer,
    notification: notificationReducer,
    calculate: calculateReducer,
    contact: contactReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST, REHYDRATE, PAUSE, FLUSH, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
