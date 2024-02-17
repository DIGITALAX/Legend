import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IsGranteeState {
  value: boolean;
}

const initialIsGranteeState: IsGranteeState = {
  value: false,
};

export const isIsGranteeSlice = createSlice({
  name: "isIsGrantee",
  initialState: initialIsGranteeState,
  reducers: {
    setIsGrantee: (state: IsGranteeState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsGrantee } = isIsGranteeSlice.actions;

export default isIsGranteeSlice.reducer;
