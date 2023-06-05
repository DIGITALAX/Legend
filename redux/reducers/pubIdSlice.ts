import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PubIdState {
  pubId: number | undefined;
}

const initialPubIdState: PubIdState = {
  pubId: undefined,
};

export const pubIdSlice = createSlice({
  name: "pubId",
  initialState: initialPubIdState,
  reducers: {
    setPubId: (state: PubIdState, action: PayloadAction<number | undefined>) => {
      state.pubId = action.payload;
    },
  },
});

export const { setPubId } = pubIdSlice.actions;

export default pubIdSlice.reducer;
