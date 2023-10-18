import { createSlice } from "@reduxjs/toolkit";

export interface MediaExpandState {
  value: boolean;
  media: string;
  type: string;
}

const initialMediaExpandState: MediaExpandState = {
  value: false,
  media: "",
  type: "",
};

export const mediaExpandSlice = createSlice({
  name: "mediaExpand",
  initialState: initialMediaExpandState,
  reducers: {
    setMediaExpand: (
      state: MediaExpandState,
      { payload: { actionValue, actionMedia, actionType } }
    ) => {
      state.value = actionValue;
      state.media = actionMedia;
      state.type = actionType;
    },
  },
});

export const { setMediaExpand } = mediaExpandSlice.actions;

export default mediaExpandSlice.reducer;
