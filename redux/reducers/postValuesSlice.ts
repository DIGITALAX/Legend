import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PostValuesState {
  value: {
    title: string | undefined;
    editionAmount: number;
    description: string | undefined;
    sustained: string | undefined;
    involved: string | undefined;
    price: number;
    referralFee: number;
    currency: string | undefined;
    recipients: {
      recipient: string;
      split: number;
    }[];
  };
}

const initialPostValuesState: PostValuesState = {
  value: {
    title: undefined,
    editionAmount: 100,
    description: undefined,
    sustained: undefined,
    involved: undefined,
    price: 1,
    referralFee: 0,
    currency: "",
    recipients: [],
  },
};

export const postValuesSlice = createSlice({
  name: "postValues",
  initialState: initialPostValuesState,
  reducers: {
    setPostValues: (
      state: PostValuesState,
      action: PayloadAction<{
        title: string | undefined;
        editionAmount: number;
        description: string | undefined;
        sustained: string | undefined;
        involved: string | undefined;
        price: number;
        referralFee: number;
        currency: string | undefined;
        recipients: {
          recipient: string;
          split: number;
        }[];
      }>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setPostValues } = postValuesSlice.actions;

export default postValuesSlice.reducer;
