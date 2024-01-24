import { Grant } from "@/components/Grants/types/grant.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AllGrantsState {
  levels: Grant[];
}

const initialAllGrantsState: AllGrantsState = {
  levels: [],
};

export const allGrantsSlice = createSlice({
  name: "allGrants",
  initialState: initialAllGrantsState,
  reducers: {
    setAllGrants: (state: AllGrantsState, action: PayloadAction<Grant[]>) => {
      state.levels = action.payload;
    },
  },
});

export const { setAllGrants } = allGrantsSlice.actions;

export default allGrantsSlice.reducer;
