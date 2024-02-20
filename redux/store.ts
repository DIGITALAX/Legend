import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import walletConnectedReducer from "./reducers/walletConnectedSlice";
import lensProfileReducer from "./reducers/lensProfileSlice";
import claimProfileReducer from "./reducers/claimProfileSlice";
import cartItemsReducer from "./reducers/cartItemsSlice";
import cartAnimReducer from "./reducers/cartAnimSlice";
import isGranteeReducer from "./reducers/isGranteeSlice";
import errorModalReducer from "./reducers/errorModalSlice";
import imageExpandReducer from "./reducers/mediaExpandSlice";
import availableCollectionsReducer from "./reducers/availableCollectionsSlice";
import postReducer from "./reducers/postSlice";
import grantCollectedReducer from "./reducers/grantCollectedSlice";
import levelArrayReducer from "./reducers/levelArraySlice";
import allGrantsReducer from "./reducers/allGrantsSlice";
import oracleDataReducer from "./reducers/oracleDataSlice";
import indexerReducer from "./reducers/indexerSlice";
import collectionsCacheReducer from "./reducers/collectionsCacheSlice";
import postCollectGifReducer from "./reducers/postCollectGifSlice";
import availableCurrenciesReducer from "./reducers/availableCurrenciesSlice";
import granteeModalReducer from "./reducers/granteeModalSlice";
import milestoneClaimReducer from "./reducers/milestoneClaimSlice";

const reducer = combineReducers({
  walletConnectedReducer,
  lensProfileReducer,
  cartItemsReducer,
  cartAnimReducer,
  isGranteeReducer,
  errorModalReducer,
  imageExpandReducer,
  availableCollectionsReducer,
  levelArrayReducer,
  allGrantsReducer,
  oracleDataReducer,
  claimProfileReducer,
  indexerReducer,
  collectionsCacheReducer,
  postReducer,
  postCollectGifReducer,
  availableCurrenciesReducer,
  granteeModalReducer,
  grantCollectedReducer,
  milestoneClaimReducer,
});

export const store = configureStore({
  reducer: {
    app: reducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
