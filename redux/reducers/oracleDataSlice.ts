import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../../graphql/generated";
import { OracleData } from "@/components/Launch/types/launch.types";

export interface OracleDataState {
  data: OracleData[];
}

const initialOracleDataState: OracleDataState = {
  data: [],
};

export const oracleDataSlice = createSlice({
  name: "oracleData",
  initialState: initialOracleDataState,
  reducers: {
    setOracleData: (
      state: OracleDataState,
      action: PayloadAction<OracleData[]>
    ) => {
      state.data = action.payload;
    },
  },
});

export const { setOracleData } = oracleDataSlice.actions;

export default oracleDataSlice.reducer;
