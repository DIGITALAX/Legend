import { PrintItem } from "@/components/Launch/types/launch.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CollectionsCacheState {
  value: PrintItem[];
}

const initialCollectionsCacheState: CollectionsCacheState = {
  value: [],
};

export const collectionsCacheSlice = createSlice({
  name: "collectionsCache",
  initialState: initialCollectionsCacheState,
  reducers: {
    setCollectionsCache: (
      state: CollectionsCacheState,
      action: PayloadAction<PrintItem[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCollectionsCache } = collectionsCacheSlice.actions;

export default collectionsCacheSlice.reducer;
