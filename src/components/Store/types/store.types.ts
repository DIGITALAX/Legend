import { PrintItem } from "@/components/Launch/types/launch.types";
import { NextRouter } from "next/router";
import { Ref, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { Profile } from "../../../../graphql/generated";

export type FilterProps = {
  searchFilters: {
    printType: string[];
    timestamp: string;
    grant: string;
    designer: string;
    designerAddress: string;
  };
  setSearchFilters: (e: {
    printType: string[];
    timestamp: string;
    grant: string;
    designer: string;
    designerAddress: string;
  }) => void;
  inputElement: Ref<HTMLInputElement>;
  lensConnected: Profile | undefined;
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  profilesOpen: boolean[];
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  mentionProfiles: Profile[];
  setCaretCoord: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
};

export type StoreItemProps = {
  collection: PrintItem;
  mirrorChoiceOpen: boolean;
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  index: number;
  mirror: (id: string) => Promise<void>;
  bookmark: (id: string) => Promise<void>;
  like: (
    id: string,
    hasReacted: boolean,
    main?: boolean | undefined
  ) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  interactionsLoading: {
    mirror: boolean;
    bookmark: boolean;
    like: boolean;
    comment: boolean;
    simpleCollect: boolean;
  };
};
