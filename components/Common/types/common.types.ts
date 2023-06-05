import { Dispatch, FormEvent } from "react";
import TopBarTwo from "../modules/TopBarTwo";
import { Collection } from "@/components/Launch/types/launch.types";
import { AnyAction } from "redux";

export type SmallBoxProps = {
  title: string;
  value: any;
  onChangeFunction: (e: FormEvent) => void;
  collapseNumber: boolean[];
  index: number;
  dispatch: Dispatch<AnyAction>;
};

export type TopBarThreeProps = {
  text: string;
  collapseNumber?: boolean[];
  dispatch?: Dispatch<AnyAction>;
  index?: number;
};

export type TopBarTwoProps = {
  deleteFunction?: () => void;
  collapseNumber?: boolean[];
  dispatch?: Dispatch<AnyAction>;
  index?: number;
};

export type CollectionAddProps = {
  index: number;
  deleteFunction?: () => void;
  position?: {
    x: string;
    y: string;
  };
  editionAmount: number;
  productInformation: Collection;
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

export type TopBarOneProps = {
  collapseNumber?: boolean[];
  dispatch?: Dispatch<AnyAction>;
  index?: number;
};
