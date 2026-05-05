// src/redux/features/contact/contactSlice.ts
import { TContact } from "@/redux/types/contact";
import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
  contacts: TContact[];
};

const initialState: TInitialState = {
  contacts: [],
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
});

export default contactSlice.reducer;
