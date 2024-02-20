import { CartItem } from "@/components/Checkout/types/checkout.types";
import { createSlice } from "@reduxjs/toolkit";

export interface MilestoneClaimState {
  open: boolean;
  milestone?: number;
  cover?: string;
}

const initialMilestoneClaimState: MilestoneClaimState = {
  open: false,
};

export const milestoneClaimSlice = createSlice({
  name: "milestoneClaim",
  initialState: initialMilestoneClaimState,
  reducers: {
    setMilestoneClaim: (
      state: MilestoneClaimState,
      { payload: { actionOpen, actionMilestone, actionCover } }
    ) => {
      state.open = actionOpen;
      state.milestone = actionMilestone;
      state.cover = actionCover;
    },
  },
});

export const { setMilestoneClaim } = milestoneClaimSlice.actions;

export default milestoneClaimSlice.reducer;
