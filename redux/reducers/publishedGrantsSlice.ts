import { createSlice } from "@reduxjs/toolkit";
import { Post } from "../../graphql/generated";
import { LevelInfo } from "@/components/Launch/types/launch.types";

export interface PublishedGrantsState {
  items: Post[];
  apparel: LevelInfo[][];
  cursor?: string;
}

const initialPublishedGrantsState: PublishedGrantsState = {
  items: [],
  apparel: [],
  cursor: undefined,
};

export const publishedGrantsSlice = createSlice({
  name: "publishedGrants",
  initialState: initialPublishedGrantsState,
  reducers: {
    setPublishedGrants: (
      state: PublishedGrantsState,
      { payload: { actionItems, actionApparel, actionCursor } }
    ) => {
      state.items = actionItems;
      state.apparel = actionApparel;
      state.cursor = actionCursor;
    },
  },
});

export const { setPublishedGrants } = publishedGrantsSlice.actions;

export default publishedGrantsSlice.reducer;
