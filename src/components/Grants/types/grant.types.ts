import { AnyAction, Dispatch } from "redux";
import { Post, Profile } from "../../../../graphql/generated";
import { NextRouter } from "next/router";
import { LevelInfo, PrintItem } from "@/components/Launch/types/launch.types";
import { CartItem } from "@/components/Checkout/types/checkout.types";
import { SetStateAction } from "react";

export type GrantProps = {
  grant: Grant;
  like: (
    id: string,
    hasReacted: boolean,
    main?: boolean | undefined
  ) => Promise<void>;
  mirror: (id: string) => Promise<void>;
  bookmark: (id: string) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  followProfile: (
    id: string,
    index: number,
    innerIndex: number,
    main?: boolean | undefined
  ) => Promise<void>;
  unfollowProfile: (
    id: string,
    index: number,
    innerIndex: number,
    main?: boolean | undefined
  ) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    bookmark: boolean;
    like: boolean;
    unfollow: boolean[];
    follow: boolean[];
  }[];
  index: number;
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  mirrorChoiceOpen: boolean[];
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

export type MirrorBoxProps = {
  showMoreMirrors: () => Promise<void>;
  showMoreQuotes: () => Promise<void>;
  mirrors: Profile[] | undefined;
  quotes: Profile[] | undefined;
  grantQuote: string;
  setGrantQuote: (e: string) => void;
};

export type CommentBoxProps = {
  showMoreComments: () => Promise<void>;
  comments: Profile[] | undefined;
  grantComment: string;
  setGrantComment: (e: string) => void;
};

export type LikeBoxProps = {
  showMoreLikes: () => Promise<void>;
  likes: Profile[] | undefined;
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
    milestones: string;
    team: string;
    tech: string;
    title: string;
  };
  granteeAddresses: string[];
  splits: string[];
  uri: string;
  profileId: string;
  milestones: {
    allClaimed: string;
    status: string;
    submitBy: string;
    granteeClaimed: boolean[];
    currencyGoal: {
      currency: string;
      amount: string;
    }[];
  };
  levelInfo: LevelInfo[];
  acceptedCurrencies: string[];
  blockTimestamp: string;
  blockNumber: string;
  publication?: Post;
}
