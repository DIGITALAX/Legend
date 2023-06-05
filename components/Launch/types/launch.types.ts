import { Erc20, Profile } from "@/components/home.types";
import JSZip from "jszip";
import { FormEvent, KeyboardEvent, Ref, RefObject } from "react";
import { AnyAction, Dispatch } from "redux";

export type SwitchLaunchProps = {
  profile: Profile | undefined;
  page: number;
};

export type PostDetailsProps = {
  title: string | undefined;
  setTitle: (e: string) => void;
  recipients: { recipient: string; split: number }[];
  setRecipients: (e: { recipient: string; split: number }[]) => void;
  currency: string | undefined;
  setCurrency: (e: string) => void;
  editionAmount: number;
  setEditionAmount: (e: number) => void;
  referralFee: number;
  setReferralFee: (e: number) => void;
  valueAmount: number;
  setValueAmount: (e: number) => void;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  handlePostDescription: (e: FormEvent) => Promise<void>;
  postDescription: string;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  caretCoord: {
    x: number;
    y: number;
  };
  handleMentionClick: (user: Profile) => void;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  enabledCurrencies: Erc20[];
  involved: string | undefined;
  setInvolved: (e: string) => void;
  sustained: string | undefined;
  setSustained: (e: string) => void;
  filledInAmount: number;
  collapseNumber: boolean[];
  dispatch: Dispatch<AnyAction>;
};

export type PreviewProps = {
  title: string | undefined;
  postDescription: string | undefined;
  referralFee: number;
  recipients: { recipient: string; split: number }[];
  editionAmount: number;
  valueAmount: number;
  currency: string | undefined;
  involved: string | undefined;
  sustained: string | undefined;
};

export type NextButtonProps = {
  setPage: () => void;
  text: string;
};

export type ImageUploadDynamicProps = {
  zipLoading: boolean;
  uploadZip: (e: FormEvent) => Promise<void>;
  fileUploadCount: number;
  editionAmount: number;
  fileUploadAmount: number;
  currentImageIndex: number;
  setCurrentImageIndex: (e: number) => void;
  NFTURIValues: string[];
  handleDropImage: (sourceIndex: number, targetIndex: number) => void;
};

export type ContractsProps = {
  createContracts: () => Promise<void>;
  createContractsLoading: boolean;
  addresses: string[];
};

export type KeeperProps = {
  keeperRegisterLoading: boolean;
  registerUpkeep: () => Promise<void>;
  sendLink: () => Promise<void>;
  balanceAmount: number | undefined;
  text: string;
};

export type StoreProps = {
  productInformation: Collection[];
  newPosition: {
    x: string;
    y: string;
  }[];
  setNewPosition: (
    e: {
      x: string;
      y: string;
    }[]
  ) => void;
  editionAmount: number;
  handleTitle: (e: FormEvent, index: number) => void;
  handleDescription: (e: FormEvent, index: number) => void;
  handleEditionAmount: (e: FormEvent, index: number) => void;
  handleCollectionPrices: (
    e: FormEvent,
    address: string,
    index: number
  ) => void;
  imageLoading: boolean[];
  handleImageUpload: (e: FormEvent, index: number) => Promise<void>;
  mintCollection: (e: number) => Promise<void>;
  minted: boolean[];
  collectionLoading: boolean[];
  handleDiscount: (e: FormEvent, index: number) => void;
  handlePrintType: (e: FormEvent, index: number) => void;
  handleGrantOnly: (e: FormEvent, index: number) => void;
};

export interface Collection {
  acceptedTokens: string[];
  basePrices: number[];
  printType: string;
  discount: number;
  grantOnly: boolean;
  uri: {
    description: string;
    external_url: string;
    image: string;
    name: string;
    type: string;
  };
  amount: number;
}

export type LiveProps = {
  profile: Profile | undefined;
  postValues: {
    title: string | undefined;
    editionAmount: number;
    description: string | undefined;
    sustained: string | undefined;
    involved: string | undefined;
    price: number;
    referralFee: number;
    currency: string | undefined;
    recipients: {
      recipient: string;
      split: number;
    }[];
  };
  storefrontValues: Collection[];
  NFTURIArray: string[];
  contractValues: string[];
  postGrant: () => Promise<void>;
  postLoading: boolean;
  nextStore: number;
  setNextStore: (e: number) => void;
  nextURI: number;
  setNextURI: (e: number) => void;
  enabledCurrencies: Erc20[];
};
