import { Details } from "@/components/Launch/types/launch.types";
import { NextRouter } from "next/router";
import { SetStateAction } from "react";

export type BarProps = {
  title: string;
  link?: string;
  router?: NextRouter;
};

export type PurchaseTokensProps = {
  details: Details;
  setDetails: (e: SetStateAction<Details[][]>) => void;
  mainIndex: number;
  levelIndex: number;
  tokens: string[];
};
