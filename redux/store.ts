import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import walletConnectedReducer from "./reducers/walletConnectedSlice";
import lensProfileReducer from "./reducers/lensProfileSlice";
import claimProfileReducer from "./reducers/claimProfileSlice";
import cartItemsReducer from "./reducers/cartItemsSlice";
import cartAnimReducer from "./reducers/cartAnimSlice";
import granteeReducer from "./reducers/granteeSlice";
import errorModalReducer from "./reducers/errorModalSlice";
import imageExpandReducer from "./reducers/mediaExpandSlice";
import availableCollectionsReducer from "./reducers/availableCollectionsSlice";
import postReducer from "./reducers/postSlice";
import levelArrayReducer from "./reducers/levelArraySlice";
import allGrantsReducer from "./reducers/allGrantsSlice";
import oracleDataReducer from "./reducers/oracleDataSlice";
import indexerReducer from "./reducers/indexerSlice";
import collectionsCacheReducer from "./reducers/collectionsCacheSlice";

const reducer = combineReducers({
  walletConnectedReducer,
  lensProfileReducer,
  cartItemsReducer,
  cartAnimReducer,
  granteeReducer,
  errorModalReducer,
  imageExpandReducer,
  availableCollectionsReducer,
  levelArrayReducer,
  allGrantsReducer,
  oracleDataReducer,
  claimProfileReducer,
  indexerReducer,
  collectionsCacheReducer,
  postReducer
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
