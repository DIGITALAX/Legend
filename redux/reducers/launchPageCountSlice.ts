import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LaunchPageCountState {
  value: number;
}

const initialLaunchPageCountState: LaunchPageCountState = {
  value: 0,
};

export const launchPageCountSlice = createSlice({
  name: "launchPageCount",
  initialState: initialLaunchPageCountState,
  reducers: {
    setLaunchPageCount: (
      state: LaunchPageCountState,
      action: PayloadAction<number>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setLaunchPageCount } = launchPageCountSlice.actions;

export default launchPageCountSlice.reducer;