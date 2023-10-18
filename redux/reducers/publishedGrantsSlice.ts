import { createSlice } from "@reduxjs/toolkit";
import { Post } from "../../graphql/generated";

export interface PublishedGrantsState {
  items: Post[];
  apparel: any[];
  uma: any[];
  cursor?: string;
}

const initialPublishedGrantsState: PublishedGrantsState = {
  items: [],
  apparel: [],
  uma: [],
  cursor: undefined,
};

export const publishedGrantsSlice = createSlice({
  name: "publishedGrants",
  initialState: initialPublishedGrantsState,
  reducers: {
    setPublishedGrants: (
      state: PublishedGrantsState,
      { payload: { actionItems, actionApparel, actionCursor, actionUmaInfo } }
    ) => {
      state.items = actionItems;
      state.apparel = actionApparel;
      state.uma = actionUmaInfo;
      state.cursor = actionCursor;
    },
  },
});

export const { setPublishedGrants } = publishedGrantsSlice.actions;

export default publishedGrantsSlice.reducer;
