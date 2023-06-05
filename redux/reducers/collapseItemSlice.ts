import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CollapseItemState {
  value: boolean[];
}

const initialCollapseItemState: CollapseItemState = {
  value: Array.from({ length: 5 }, () => false),
};

export const collapseItemSlice = createSlice({
  name: "collapseItem",
  initialState: initialCollapseItemState,
  reducers: {
    setCollapseItem: (
      state: CollapseItemState,
      action: PayloadAction<boolean[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCollapseItem } = collapseItemSlice.actions;

export default collapseItemSlice.reducer;
