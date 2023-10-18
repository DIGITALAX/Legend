import { LevelInfo } from "@/components/Launch/types/launch.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LevelArrayState {
  collections: LevelInfo[];
}

const initialLevelArrayState: LevelArrayState = {
    collections: [],
};

export const levelArraySlice = createSlice({
  name: "levelArray",
  initialState: initialLevelArrayState,
  reducers: {
    setLevelArray: (
      state: LevelArrayState,
      action: PayloadAction<LevelInfo[]>
    ) => {
      state.collections = action.payload;
    },
  },
});

export const { setLevelArray } = levelArraySlice.actions;

export default levelArraySlice.reducer;
