import { Details } from "@/components/Launch/types/launch.types";
import { SetStateAction } from "react";

export type BarProps = {
  title: string;
};

export type PurchaseTokensProps = {
  details: Details;
  setDetails: (e: SetStateAction<Details[][]>) => void;
  mainIndex: number
  levelIndex: number
};
