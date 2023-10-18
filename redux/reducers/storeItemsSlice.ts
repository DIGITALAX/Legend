import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StoreItemsState {
  items: any[];
}

const initialStoreItemsState: StoreItemsState = {
  items: [],
};

export const storeItemsSlice = createSlice({
  name: "storeItems",
  initialState: initialStoreItemsState,
  reducers: {
    setStoreItems: (
      state: StoreItemsState,
      action: PayloadAction<any[]>
    ) => {
      state.items = action.payload;
    },
  },
});

export const { setStoreItems } = storeItemsSlice.actions;

export default storeItemsSlice.reducer;
