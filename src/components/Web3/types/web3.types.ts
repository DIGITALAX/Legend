import { Grant } from "@/components/Grants/types/grant.types";
import { NextRouter } from "next/router";
import { SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";

export type GrantItemProps = {
  grant: Grant;
  index: number;
  like: (id: string, hasReacted: boolean, main?: boolean) => Promise<void>;
  mirrorChoiceOpen: boolean;
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  mirror: (id: string) => Promise<void>;
  bookmark: (id: string) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  interactionsLoading: {
    mirror: boolean;
    bookmark: boolean;
    like: boolean;
    comment: boolean;
    simpleCollect: boolean;
  };
  showFundedHover: boolean;
  setShowFundedHover: (e: SetStateAction<boolean[]>) => void;
};
