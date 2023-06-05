import { UploadedMedia } from "@/components/home.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CommentImagesState {
  value: UploadedMedia[];
}

const initialCommentImagesState: CommentImagesState = {
  value: [],
};

export const commentImagesSlice = createSlice({
  name: "commentImages",
  initialState: initialCommentImagesState,
  reducers: {
    setCommentImages: (
      state: CommentImagesState,
      action: PayloadAction<UploadedMedia[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCommentImages } = commentImagesSlice.actions;

export default commentImagesSlice.reducer;
