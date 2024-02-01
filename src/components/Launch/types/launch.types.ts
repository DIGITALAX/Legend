import { NextRouter } from "next/router";
import { ChangeEvent, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { Profile } from "../../../../graphql/generated";
import { CartItem } from "@/components/Checkout/types/checkout.types";

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
  indexes: {
    levelIndex: number;
    imageIndex: number;
    rate: number;
    price: number[];
    priceIndex: number;
    currency: string;
    itemIndex: number;
  }[];
  handleChangeCurrency: (
    levelIndex: number,
    priceIndex: number,
    checkoutCurrency: string,
    checkoutPrice: number
  ) => void;
  handleChangeImage: (levelIndex: number, imageIndex: number) => void;
  handleChangeItem: (levelIndex: number, newItemIndex: number) => void;
};

export type DeployProps = {
  grantStage: number;
  setGrantStage: (e: number) => void;
  postInformation: PostInformation;
  setPostInformation: (e: SetStateAction<PostInformation>) => void;
  dispatch: Dispatch<AnyAction>;
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
  printType: PrintType;
  fulfiller: string;
  fulfillerPercent: number;
  designerPercent: number;
  fulfillerBase: number;
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
  designer: number;
  fulfiller: number;
  grantee: number;
  onlyGrantee?: boolean;
};

export type LaunchSwitchProps = {
  postInformation: PostInformation;
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
  indexes: {
    levelIndex: number;
    imageIndex: number;
    rate: number;
    price: number[];
    priceIndex: number;
    currency: string;
    itemIndex: number;
  }[];
  handleChangeCurrency: (
    levelIndex: number,
    priceIndex: number,
    checkoutCurrency: string,
    checkoutPrice: number
  ) => void;
  handleChangeImage: (levelIndex: number, imageIndex: number) => void;
  handleChangeItem: (levelIndex: number, newItemIndex: number) => void;
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
  allCollectionsLoading: boolean;
  indexes: {
    levelIndex: number;
    imageIndex: number;
    rate: number;
    price: number[];
    priceIndex: number;
    currency: string;
    itemIndex: number;
  }[];
  handleChangeCurrency: (
    levelIndex: number,
    priceIndex: number,
    checkoutCurrency: string,
    checkoutPrice: number
  ) => void;
  handleChangeImage: (levelIndex: number, imageIndex: number) => void;
  handleChangeItem: (levelIndex: number, newItemIndex: number) => void;
};

export type CollectItemProps = {
  levelsLoading?: boolean;
  levelInfo: LevelInfo;
  index: {
    levelIndex: number;
    imageIndex: number;
    rate: number;
    currency: string;
    price: number[];
    priceIndex: number;
    itemIndex: number;
  };
  handleChangeCurrency: (
    levelIndex: number,
    priceIndex: number,
    checkoutCurrency: string,
    checkoutPrice: number
  ) => void;
  handleChangeImage: (levelIndex: number, imageIndex: number) => void;
  handleChangeItem: (levelIndex: number, newItemIndex: number) => void;
  cart?: boolean;
  cartItems?: CartItem[];
  router?: NextRouter;
  dispatch?: Dispatch<AnyAction>;
  id?: string;
  handleCheckout: (item: CartItem) => Promise<void>;
  simpleCollectLoading: boolean;
};

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
  index: {
    levelIndex: number;
    imageIndex: number;
    rate: number;
    currency: string;
    price: number[];
    priceIndex: number;
    itemIndex: number;
  };
  handleChangeCurrency: (
    levelIndex: number,
    priceIndex: number,
    checkoutCurrency: string,
    checkoutPrice: number
  ) => void;
};
