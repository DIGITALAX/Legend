import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import noHandleReducer from "./reducers/noHandleSlice";
import profileReducer from "./reducers/profileSlice";
import authReducer from "./reducers/authSlice";
import indexReducer from "./reducers/indexSlice";
import IPFSReducer from "./reducers/IPFSSlice";
import publicationImageReducer from "./reducers/publicationImageSlice";
import commentImagesReducer from "./reducers/commentImagesSlice";
import dispatcherReducer from "./reducers/dispatcherSlice";
import postValuesReducer from "./reducers/postValuesSlice";
import NFTImageArrayReducer from "./reducers/NFTImageArraySlice";
import launchPageCountReducer from "./reducers/launchPageCountSlice";
import storefrontValuesReducer from "./reducers/storefrontValuesSlice";
import contractValuesReducer from "./reducers/contractValuesSlice";
import collapseItemLaunchReducer from "./reducers/collapseItemLaunchSlice";
import collapseItemReducer from "./reducers/collapseItemSlice";
import pubIdReducer from "./reducers/pubIdSlice";

const reducer = combineReducers({
  noHandleReducer,
  authReducer,
  profileReducer,
  indexReducer,
  IPFSReducer,
  publicationImageReducer,
  commentImagesReducer,
  dispatcherReducer,
  postValuesReducer,
  NFTImageArrayReducer,
  launchPageCountReducer,
  storefrontValuesReducer,
  contractValuesReducer,
  collapseItemLaunchReducer,
  collapseItemReducer,
  pubIdReducer,
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
