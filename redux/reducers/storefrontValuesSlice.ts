import { Collection } from "@/components/Launch/types/launch.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StorefrontValuesState {
  value: Collection[];
}

const initialStorefrontValuesState: StorefrontValuesState = {
  value: [],
};

export const storefrontValuesSlice = createSlice({
  name: "storefrontValues",
  initialState: initialStorefrontValuesState,
  reducers: {
    setStorefrontValues: (
      state: StorefrontValuesState,
      action: PayloadAction<Collection[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setStorefrontValues } = storefrontValuesSlice.actions;

export default storefrontValuesSlice.reducer;
