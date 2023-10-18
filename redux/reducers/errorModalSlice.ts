import { createSlice } from "@reduxjs/toolkit";

export interface ErrorModalState {
  value: boolean;
  message: string;
}

const initialErrorModalState: ErrorModalState = {
  value: false,
  message: "",
};

export const errorModalSlice = createSlice({
  name: "errorModal",
  initialState: initialErrorModalState,
  reducers: {
    setErrorModal: (
      state: ErrorModalState,
      { payload: { actionValue, actionMessage } }
    ) => {
      state.value = actionValue;
      state.message = actionMessage;
    },
  },
});

export const { setErrorModal } = errorModalSlice.actions;

export default errorModalSlice.reducer;
