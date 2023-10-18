import { PrintItem } from "@/components/Launch/types/launch.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AvailableCollectionsState {
  collections: { [key: string]: PrintItem[] } | undefined;
}

const initialAvailableCollectionsState: AvailableCollectionsState = {
  collections: undefined,
};

export const availableCollectionsSlice = createSlice({
  name: "availableCollections",
  initialState: initialAvailableCollectionsState,
  reducers: {
    setAvailableCollections: (
      state: AvailableCollectionsState,
      action: PayloadAction<{ [key: string]: PrintItem[] }>
    ) => {
      state.collections = action.payload;
    },
  },
});

export const { setAvailableCollections } = availableCollectionsSlice.actions;

export default availableCollectionsSlice.reducer;
