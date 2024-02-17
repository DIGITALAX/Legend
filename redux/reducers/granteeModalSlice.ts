import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GranteeModalState {
  value: boolean;
}

const initialGranteeModalState: GranteeModalState = {
  value: false,
};

export const granteeModalSlice = createSlice({
  name: "granteeModal",
  initialState: initialGranteeModalState,
  reducers: {
    setGranteeModal: (state: GranteeModalState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setGranteeModal } = granteeModalSlice.actions;

export default granteeModalSlice.reducer;
