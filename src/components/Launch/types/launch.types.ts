import { NextRouter } from "next/router";
import { ChangeEvent } from "react";
import { AnyAction, Dispatch } from "redux";
import { Profile } from "../../../../graphql/generated";

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
  handleActivateMilestone: (index: number) => Promise<void>;
  handleClaimMilestone: (index: number) => Promise<void>;
  activateMilestoneLoading: boolean[];
  claimMilestoneLoading: boolean[];
  postInformation: PostInformation;
  setPostInformation: (e: PostInformation) => void;
};

export type RegisterAndPostProps = {
  handleRegisterGrant: () => Promise<void>;
  grantRegistered: boolean;
  handlePostGrant: () => Promise<void>;
  registerLoading: boolean;
  postLoading: boolean;
  grantPosted: boolean;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  profileId: string | undefined;
  signInLoading: boolean;
  connected: boolean | undefined;
};

export type PreviewProps = {
  postInformation: PostInformation;
  setPostInformation: (e: PostInformation) => void;
  levelArray: LevelInfo[];
  setPriceIndex: (e: number[][]) => void;
  priceIndex: number[][];
};

export type DeployProps = {
  grantStage: number;
  setGrantStage: (e: number) => void;
  postInformation: PostInformation;
  setPostInformation: (e: PostInformation) => void;
  dispatch: Dispatch<AnyAction>;
};

export type InformationProps = {
  postInformation: PostInformation;
  setPostInformation: (e: PostInformation) => void;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  imageLoading: boolean;
};

export type GranteesProps = {
  postInformation: PostInformation;
  setPostInformation: (e: PostInformation) => void;
};

export interface PrintItem {
  collectionId: string;
  uri: {
    images: string[];
    description: string;
    title: string;
    profileId: string;
  };
  profile: Profile;
  prices: string[];
  printType: PrintType;
  fulfiller: string;
  fulfillerPercent: string;
  fulfillerBase: string;
  designerPercent: string;
}

export enum PrintType {
  Sticker = "0",
  Poster = "1",
  Shirt = "2",
  Hoodie = "3",
}

export interface LevelInfo {
  level: number;
  items: PrintItem[];
}

export type SplitsProps = {
  designer: number;
  fulfiller: number;
  grantee: number;
};

export type LaunchSwitchProps = {
  postInformation: PostInformation;
  levelArray: LevelInfo[];
  handleShuffleCollectionLevels: () => void;
  setPostInformation: (e: PostInformation) => void;
  grantStage: number;
  oracleData: OracleData[];
  allCollectionsLoading: boolean;
  setPriceIndex: (e: number[][]) => void;
  priceIndex: number[][];
  imageLoading: boolean;
  dateOpen: boolean[];
  setDateOpen: (e: boolean[]) => void;
  handleActivateMilestone: (index: number) => Promise<void>;
  handleClaimMilestone: (index: number) => Promise<void>;
  activateMilestoneLoading: boolean[];
  claimMilestoneLoading: boolean[];
  handleInputDateChange: (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  handleDateSelect: (date: Date | undefined, index: number) => void;
  selectedDate: (Date | undefined)[];
  inputDateValue: string[];
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRegisterGrant: () => Promise<void>;
  grantRegistered: boolean;
  handlePostGrant: () => Promise<void>;
  registerLoading: boolean;
  postLoading: boolean;
  grantPosted: boolean;
  router: NextRouter;
  pubId: number | undefined;
  profileId: string | undefined;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  connected: boolean | undefined;
  signInLoading: boolean;
  checkoutCurrency: string[];
  setCheckoutCurrency: (e: string[]) => void;
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
}

export interface Milestone {
  description: string;
  amount: number;
  submit: string;
  image: string;
}

export type CollectionShuffleProps = {
  handleShuffleCollectionLevels: () => void;
  levelArray: LevelInfo[];
  allCollectionsLoading: boolean;
  setPriceIndex: (e: number[][]) => void;
  priceIndex: number[][];
  checkoutCurrency: string[];
  setCheckoutCurrency: (e: string[]) => void;
  oracleData: OracleData[];
};

export type CollectItemProps = {
  index: number;
  allCollectionsLoading?: boolean;
  item: LevelInfo;
  setPriceIndex: (e: number[][]) => void;
  priceIndex: number[][];
  checkoutCurrency: string[];
  setCheckoutCurrency: (e: string[]) => void;
  oracleData: OracleData[];
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
  checkoutCurrency: string[];
  setCheckoutCurrency: (e: string[]) => void;
  oracleData: OracleData[];
};
