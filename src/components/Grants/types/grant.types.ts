import { AnyAction, Dispatch } from "redux";
import { Post, Profile } from "../../../../graphql/generated";
import { NextRouter } from "next/router";
import {
  Details,
  LevelInfo,
  OracleData,
  PrintItem,
} from "@/components/Launch/types/launch.types";
import { CartItem } from "@/components/Checkout/types/checkout.types";
import { SetStateAction } from "react";

export type GrantProps = {
  grant: Grant;
  oracleData: OracleData[];
  like: (
    id: string,
    hasReacted: boolean,
    main?: boolean | undefined
  ) => Promise<void>;
  setDetails: (e: SetStateAction<Details[][]>) => void;
  details: Details[];
  handleCheckout: (item: CartItem, curreny: string) => Promise<void>;
  simpleCollectLoading: boolean;
  mirror: (id: string) => Promise<void>;
  bookmark: (id: string) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  interactionsLoading: {
    mirror: boolean;
    bookmark: boolean;
    like: boolean;
    unfollow: boolean[];
    follow: boolean[];
    simpleCollect: boolean;
  };
  cartItems: CartItem[];
  mainIndex: number;
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  mirrorChoiceOpen: boolean[];
  approvePurchase: (item: CartItem, curreny: string) => Promise<void>;
  spendApproved: boolean;
  changeCurrency: string;
  setChangeCurrency: (e: SetStateAction<string[]>) => void;
};

export type CollectItemProps = {
  index: number;
  router: NextRouter;
  setCollectChoice: (e: { color: string; size: string }[]) => void;
  collectChoice: {
    color: string;
    size: string;
  }[];
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  id: string;
  items: PrintItem[];
};

export interface Milestone {
  allClaimed: string;
  status: string;
  submitBy: string;
  granteeClaimed: boolean[];
  currencyGoal: {
    currency: string;
    amount: string;
  }[];
}

export type MilestoneProps = {
  milestone: Milestone;
  index: number;
  mainIndex: number;
  acceptedTokens: string[];
  metadata: {
    description: string;
    cover: string;
  };
  changeCurrency: string;
  setChangeCurrency: (e: SetStateAction<string[]>) => void;
};

export interface Grant {
  grantId: string;
  creator: string;
  pubId: string;
  grantMetadata: {
    cover: string;
    description: string;
    experience: string;
    strategy: string;
    milestones: {
      description: string;
      cover: string;
    }[];
    team: string;
    tech: string;
    title: string;
  };
  grantees: Profile[];
  splits: string[];
  uri: string;
  profileId: string;
  milestones: Milestone[];
  levelInfo: LevelInfo[];
  acceptedCurrencies: string[];
  blockTimestamp: string;
  blockNumber: string;
  publication?: Post;
}

export type InteractionsProps = {
  like: (id: string, hasReacted: boolean) => Promise<void>;
  mirror: (id: string) => Promise<void>;
  post: Post;
  interactionsLoading: {
    mirror: boolean;
    bookmark: boolean;
    like: boolean;
    unfollow: boolean[];
    follow: boolean[];
    simpleCollect: boolean;
  };
  dispatch: Dispatch<AnyAction>;
  bookmark: (id: string) => Promise<void>;
  mirrorChoiceOpen: boolean;
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  router: NextRouter;
  index: number;
};
