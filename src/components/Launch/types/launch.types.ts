import { NextRouter } from "next/router";
import { ChangeEvent, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { Post, Profile } from "../../../../graphql/generated";
import { CartItem } from "@/components/Checkout/types/checkout.types";
import { Grant } from "@/components/Grants/types/grant.types";

export type MilestoneProps = {
  index: number;
  handleInputDateChange: (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  handleDateSelect: (date: Date | undefined, index: number) => void;
  selectedDate: (Date | undefined)[];
  inputDateValue: string[];
  dateOpen: boolean[];
  setDateOpen: (e: boolean[]) => void;
  postInformation: PostInformation;
  setPostInformation: (e: SetStateAction<PostInformation>) => void;
};

export type RegisterAndPostProps = {
  handlePostGrant: () => Promise<void>;
  postLoading: boolean;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  profileId: string | undefined;
  signInLoading: boolean;
  connected: boolean | undefined;
};

export type PreviewProps = {
  postInformation: PostInformation;
  levelArray: LevelInfo[];
  oracleData: OracleData[];
  details: Details[][];
  dispatch: Dispatch<AnyAction>;
  setDetails: (e: SetStateAction<Details[][]>) => void;
};

export type DeployProps = {
  grantStage: number;
  setGrantStage: (e: number) => void;
  postInformation: PostInformation;
  setPostInformation: (e: SetStateAction<PostInformation>) => void;
  dispatch: Dispatch<AnyAction>;
  isGrantee: boolean;
};

export type InformationProps = {
  postInformation: PostInformation;
  setPostInformation: (e: SetStateAction<PostInformation>) => void;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  imageLoading: boolean;
};

export type GranteesProps = {
  postInformation: PostInformation;
  setPostInformation: (e: SetStateAction<PostInformation>) => void;
};

export interface PrintItem {
  collectionId: string;
  collectionMetadata: {
    images: string[];
    sizes: string[];
    colors: string[];
    title: string;
  };
  uri: string;
  profile: Profile;
  prices: string[];
  acceptedTokens: string[];
  printType: PrintType;
  fulfiller: string;
  owner: string;
  fulfillerPercent: number;
  designerPercent: number;
  fulfillerBase: number;
  publication?: Post;
  grants?: Grant[];
  blockTimestamp: string;
}

export enum PrintType {
  Sticker = "0",
  Poster = "1",
  Shirt = "2",
  Hoodie = "3",
  Sleeve = "4",
  Crop = "5",
  NFTOnly = "6",
  Custom = "7",
  Other = "8",
}

export interface LevelInfo {
  level: number;
  collectionIds: PrintItem[];
  amounts: number[];
}

export type SplitsProps = {
  onlyGrantee?: boolean;
  price: number;
  fPercent: number;
  fBase: number;
  dPercent: number;
};

export type LaunchSwitchProps = {
  postInformation: PostInformation;
  dispatch: Dispatch<AnyAction>;
  levelArray: LevelInfo[];
  handleShuffleCollectionLevels: () => void;
  setPostInformation: (e: SetStateAction<PostInformation>) => void;
  grantStage: number;
  allCollectionsLoading: boolean;
  imageLoading: boolean;
  dateOpen: boolean[];
  setDateOpen: (e: boolean[]) => void;
  handleInputDateChange: (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  handleDateSelect: (date: Date | undefined, index: number) => void;
  selectedDate: (Date | undefined)[];
  inputDateValue: string[];
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handlePostGrant: () => Promise<void>;
  postLoading: boolean;
  router: NextRouter;
  pubId: number | undefined;
  profileId: string | undefined;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  connected: boolean | undefined;
  signInLoading: boolean;
  details: Details[][];
  setDetails: (e: SetStateAction<Details[][]>) => void;
  oracleData: OracleData[];
};

export interface PostInformation {
  title: string;
  description: string;
  coverImage: string;
  tech: string;
  strategy: string;
  experience: string;
  team: string;
  grantees: string[];
  splits: number[];
  milestones: Milestone[];
  currencies: string[];
}

export interface Milestone {
  description: string;
  currencyAmount: { currency: string; goal: number }[];
  submit: string;
  image: string;
}

export type CollectionShuffleProps = {
  handleShuffleCollectionLevels: () => void;
  levelArray: LevelInfo[];
  acceptedTokens: string[];
  dispatch: Dispatch<AnyAction>;
  allCollectionsLoading: boolean;
  details: Details[][];
  setDetails: (e: SetStateAction<Details[][]>) => void;
  oracleData: OracleData[];
};

export type CollectItemProps = {
  levelsLoading?: boolean;
  levelInfo: LevelInfo;
  mainIndex: number;
  oracleData: OracleData[];
  setDetails: (e: SetStateAction<Details[][]>) => void;
  details: Details;
  cart?: boolean;
  cartItems?: CartItem[];
  router?: NextRouter;
  dispatch: Dispatch<AnyAction>;
  grant?: Grant;
};

export interface Details {
  currency: string;
  imageIndex: number[];
  sizeIndex: number[];
  colorIndex: number[];
  collectionIndex: number;
}

export interface OracleData {
  currency: string;
  rate: string;
  wei: string;
}

export type SuccessProps = {
  router: NextRouter;
  pubId: string | undefined;
};

export type LevelOneProps = {
  details: Details;
  acceptedTokens: string[];
  setDetails: (e: SetStateAction<Details[][]>) => void;
  mainIndex: number;
  oracleData: OracleData[];
  handleCheckout?: (item: CartItem, currency: string) => Promise<void>;
  simpleCheckoutLoading?: boolean;
  cart?: boolean;
  grant?: Grant;
  spendApproved?: boolean;
  approvePurchase?: (item: CartItem, currency: string) => Promise<void>;
};
