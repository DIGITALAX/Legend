import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NFTImageArrayState {
  value: string[];
}

const initialNFTImageArrayState: NFTImageArrayState = {
  value: [],
};

export const NFTImageArraySlice = createSlice({
  name: "NFTImageArray",
  initialState: initialNFTImageArrayState,
  reducers: {
    setNFTImageArray: (
      state: NFTImageArrayState,
      action: PayloadAction<string[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setNFTImageArray } = NFTImageArraySlice.actions;

export default NFTImageArraySlice.reducer;
