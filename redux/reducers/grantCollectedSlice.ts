import { CartItem } from "@/components/Checkout/types/checkout.types";
import { createSlice } from "@reduxjs/toolkit";

export interface GrantCollectedState {
  value: boolean;
  item?: CartItem;
}

const initialGrantCollectedState: GrantCollectedState = {
  value: false,
};

export const grantCollectedSlice = createSlice({
  name: "grantCollected",
  initialState: initialGrantCollectedState,
  reducers: {
    setGrantCollected: (
      state: GrantCollectedState,
      { payload: { actionValue, actionItem } }
    ) => {
      state.value = actionValue;
      state.item = actionItem;
    },
  },
});

export const { setGrantCollected } = grantCollectedSlice.actions;

export default grantCollectedSlice.reducer;
