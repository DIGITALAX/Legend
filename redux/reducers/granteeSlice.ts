import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GranteeState {
  value: boolean;
}

const initialGranteeState: GranteeState = {
  value: false,
};

export const granteeSlice = createSlice({
  name: "grantee",
  initialState: initialGranteeState,
  reducers: {
    setGrantee: (state: GranteeState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setGrantee } = granteeSlice.actions;

export default granteeSlice.reducer;
