import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ContractValuesState {
  value: string[];
}

const initialContractValuesState: ContractValuesState = {
  value: [],
};

export const contractValuesSlice = createSlice({
  name: "contractValues",
  initialState: initialContractValuesState,
  reducers: {
    setContractValues: (
      state: ContractValuesState,
      action: PayloadAction<string[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setContractValues } = contractValuesSlice.actions;

export default contractValuesSlice.reducer;
