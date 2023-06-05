import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CollapseItemLaunchState {
  value: boolean[];
}

const initialCollapseItemLaunchState: CollapseItemLaunchState = {
  value: Array.from({ length: 9 }, () => false),
};

export const collapseItemLaunchSlice = createSlice({
  name: "collapseItemLaunch",
  initialState: initialCollapseItemLaunchState,
  reducers: {
    setCollapseItemLaunch: (
      state: CollapseItemLaunchState,
      action: PayloadAction<boolean[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCollapseItemLaunch } = collapseItemLaunchSlice.actions;

export default collapseItemLaunchSlice.reducer;
