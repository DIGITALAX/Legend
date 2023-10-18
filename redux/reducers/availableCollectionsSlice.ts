import { PrintItem } from "@/components/Launch/types/launch.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AvailableCollectionsState {
  collections: PrintItem[];
}

const initialAvailableCollectionsState: AvailableCollectionsState = {
    collections: [],
};

export const availableCollectionsSlice = createSlice({
  name: "availableCollections",
  initialState: initialAvailableCollectionsState,
  reducers: {
    setAvailableCollections: (
      state: AvailableCollectionsState,
      action: PayloadAction<PrintItem[]>
    ) => {
      state.collections = action.payload;
    },
  },
});

export const { setAvailableCollections } = availableCollectionsSlice.actions;

export default availableCollectionsSlice.reducer;
