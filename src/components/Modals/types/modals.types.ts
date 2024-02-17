import { AnyAction, Dispatch } from "redux";
import {
  Erc20,
  Post,
  Profile,
  Quote,
  SimpleCollectOpenActionModuleInput,
} from "../../../../graphql/generated";
import { SetStateAction } from "react";
import { NextRouter } from "next/router";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";
import { MakePostComment } from "@/components/Common/types/common.types";
import { CartItem } from "@/components/Checkout/types/checkout.types";

export type PostCollectGifProps = {
  dispatch: Dispatch<AnyAction>;
  type: string | undefined;
  id: string;
  handleGif: (e: string) => Promise<void>;
  openMeasure: {
    searchedGifs: string[];
    search: string;
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  };
  setOpenMeasure: (
    e: SetStateAction<{
      searchedGifs: string[];
      search: string;
      award: string;
      whoCollectsOpen: boolean;
      creatorAwardOpen: boolean;
      currencyOpen: boolean;
      editionOpen: boolean;
      edition: string;
      timeOpen: boolean;
      time: string;
    }>
  ) => void;
  availableCurrencies: Erc20[];
  gifs:
    | {
        [key: string]: string[];
      }
    | undefined;
  collectTypes:
    | {
        [key: string]: SimpleCollectOpenActionModuleInput | undefined;
      }
    | undefined;
  searchGifLoading: boolean;
};

export type CollectOptionsProps = {
  id: string;
  type: string;
  dispatch: Dispatch<AnyAction>;
  collectTypes:
    | {
        [key: string]: SimpleCollectOpenActionModuleInput | undefined;
      }
    | undefined;
  gifs:
    | {
        [key: string]: string[] | undefined;
      }
    | undefined;
  openMeasure: {
    searchedGifs: string[];
    search: string;
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  };
  setOpenMeasure: (
    e: SetStateAction<{
      searchedGifs: string[];
      search: string;
      award: string;
      whoCollectsOpen: boolean;
      creatorAwardOpen: boolean;
      currencyOpen: boolean;
      editionOpen: boolean;
      edition: string;
      timeOpen: boolean;
      time: string;
    }>
  ) => void;
  availableCurrencies: Erc20[];
};

export type MediaExpandProps = {
  dispatch: Dispatch<AnyAction>;
  image: string;
  type: string;
};

export type ErrorProps = {
  dispatch: Dispatch<AnyAction>;
  message: string;
};

export type NotGranteeProps = {
  dispatch: Dispatch<AnyAction>;
};

export type GrantCollectedProps = {
  dispatch: Dispatch<AnyAction>;
  details: CartItem;
};

export type ClaimProfileProps = {
  dispatch: Dispatch<AnyAction>;
};

export type IndexProps = {
  message: string;
};

export type PostBoxProps = {
  dispatch: Dispatch<AnyAction>;
  quote: Post;
  postCollectGif: PostCollectGifState;
  router: NextRouter;
  lensConnected: Profile | undefined;
  caretCoord: {
    x: number;
    y: number;
  };
  setCaretCoord: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  profilesOpen: boolean[];
  mentionProfiles: Profile[];
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading: {
    mirror: boolean;
    bookmark: boolean;
    like: boolean;
    comment: boolean;
    simpleCollect: boolean;
  }[];
  setContentLoading: (
    e: SetStateAction<{ image: boolean; video: boolean }[]>
  ) => void;
  contentLoading: { image: boolean; video: boolean }[];
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  makeComment: MakePostComment[];
  comment: (id: string, main?: boolean) => Promise<void>;
};
