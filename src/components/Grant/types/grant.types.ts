import { NextRouter } from "next/router";
import { SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { Profile } from "../../../../graphql/generated";
import { MakePostComment } from "@/components/Common/types/common.types";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";

export type WhoSwitchProps = {
  interactionState: string;
  router: NextRouter;
  interactionsLoading: {
    mirror: boolean;
    bookmark: boolean;
    like: boolean;
    comment: boolean;
    simpleCollect: boolean;
  }[];
  who: any[];
  whoLoading: boolean;
  handleMoreWho: () => Promise<void>;
  info: {
    hasMore: boolean;
    cursor: string | undefined;
  };
  setCommentBoxOpen: (e: SetStateAction<boolean[]>) => void;
  commentBoxOpen: boolean[];
  lensConnected: Profile | undefined;
  dispatch: Dispatch<AnyAction>;
  bookmark: (id: string, main?: boolean) => Promise<void>;
  mirrorChoiceOpen: boolean[];
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  like: (id: string, hasReacted: boolean, main?: boolean) => Promise<void>;
  comment: (id: string, main?: boolean) => Promise<void>;
  mirror: (id: string, main?: boolean) => Promise<void>;
  caretCoordMain: {
    x: number;
    y: number;
  };
  setCaretCoordMain: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  setMakeCommentMain: (e: SetStateAction<MakePostComment[]>) => void;
  setMentionProfilesMain: (e: SetStateAction<Profile[]>) => void;
  profilesOpenMain: boolean[];
  makeCommentMain: MakePostComment[];
  mentionProfilesMain: Profile[];
  setProfilesOpenMain: (e: SetStateAction<boolean[]>) => void;
  caretCoord: {
    x: number;
    y: number;
  };
  setCaretCoord: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  profilesOpen: boolean[];
  makeComment: MakePostComment[];
  mentionProfiles: Profile[];
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  mainInteractionsLoading: {
    mirror: boolean;
    bookmark: boolean;
    like: boolean;
    comment: boolean;
    simpleCollect: boolean;
  }[];
  postCollectGif: PostCollectGifState;
  id: string;
  setMainContentLoading: (
    e: SetStateAction<{ image: boolean; video: boolean }[]>
  ) => void;
  mainContentLoading: { image: boolean; video: boolean }[];
  setContentLoading: (
    e: SetStateAction<{ image: boolean; video: boolean }[]>
  ) => void;
  contentLoading: { image: boolean; video: boolean }[];
};
