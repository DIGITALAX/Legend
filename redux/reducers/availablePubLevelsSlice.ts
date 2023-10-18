import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AvailablePubLevelsState {
  levels:
    | {
        pubId: string;
        profileId: string;
        levelFive: string[];
        levelFour: string[];
        levelSeven: string[];
        levelSix: string[];
        levelThree: string[];
        levelTwo: string[];
      }[];
}

const initialAvailablePubLevelsState: AvailablePubLevelsState = {
  levels: [],
};

export const availablePubLevelsSlice = createSlice({
  name: "availablePubLevels",
  initialState: initialAvailablePubLevelsState,
  reducers: {
    setAvailablePubLevels: (
      state: AvailablePubLevelsState,
      action: PayloadAction<
        {
          pubId: string;
          profileId: string;
          levelFive: string[];
          levelFour: string[];
          levelSeven: string[];
          levelSix: string[];
          levelThree: string[];
          levelTwo: string[];
        }[]
      >
    ) => {
      state.levels = action.payload;
    },
  },
});

export const { setAvailablePubLevels } = availablePubLevelsSlice.actions;

export default availablePubLevelsSlice.reducer;
