import { AnyAction } from "redux";
import { ExplorePublication, Profile } from "../../../../graphql/generated";
import { Dispatch } from "react";
import { NextRouter } from "next/router";
import { LevelInfo } from "@/components/Launch/types/launch.types";

export enum ItemTypes {
  Poster,
  Sticker,
  Apparel,
}

export type GrantProps = {
  publication: ExplorePublication;
  imageIndex: number[];
  setImageIndex: (e: number[]) => void;
  index: number;
  commentGrant: (id: number) => Promise<void>;
  likeGrant: (id: number) => Promise<void>;
  mirrorGrant: (id: number) => Promise<void>;
  quoteGrant: (id: number) => Promise<void>;
  setCollectChoice: (e: { color: string; size: string }[]) => void;
  collectChoice: {
    color: string;
    size: string;
  }[];
  cartItems: {
    id: string;
    size: string;
    color: string;
    amount: number;
    level: number;
  }[];
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  showComments: (id: string) => Promise<void>;
  showQuotes: (id: string) => Promise<void>;
  showLikes: (id: string) => Promise<void>;
  showMirrors: (id: string) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    comment: boolean;
    quote: boolean;
    like: boolean;
  };
};

export type CollectItemProps = {
  index: number;
  router: NextRouter;
  setCollectChoice: (e: { color: string; size: string }[]) => void;
  collectChoice: {
    color: string;
    size: string;
  }[];
  cartItems: {
    id: string;
    size: string;
    color: string;
    amount: number;
    level: number;
  }[];
  dispatch: Dispatch<AnyAction>;
  id: string;
  item: LevelInfo;
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
