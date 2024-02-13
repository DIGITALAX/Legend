import { createSlice } from "@reduxjs/toolkit";
import { Post } from "../../graphql/generated";

export interface PostState {
  quote?: Post;
  value: boolean;
}

const initialPostState: PostState = {
  value: false,
};

export const postSlice = createSlice({
  name: "post",
  initialState: initialPostState,
  reducers: {
    setPost: (state: PostState, { payload: { actionValue, actionQuote } }) => {
      state.value = actionValue;
      state.quote = actionQuote;
    },
  },
});

export const { setPost } = postSlice.actions;

export default postSlice.reducer;
