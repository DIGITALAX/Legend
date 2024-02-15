import { Details } from "@/components/Launch/types/launch.types";
import { NextRouter } from "next/router";
import { ChangeEvent, Ref, SetStateAction } from "react";
import { Post, Profile } from "../../../../graphql/generated";
import { AnyAction, Dispatch } from "redux";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";

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

export interface MakePostComment {
  content: string | undefined;
  images: {
    media: string;
    type: string;
  }[];
  videos: string[];
}

export type WaveFormProps = {
  keyValue: string;
  audio: string;
  video: string;
  type: string;
  upload?: boolean;
  handleMedia?: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handlePlayVideo?: () => void;
  handlePauseVideo?: () => void;
  handleSeekVideo?: (e: number) => void;
  videoInfo?: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
  };
};

export type MediaProps = {
  type: string;
  srcUrl: string;
  srcCover?: string;
  classNameVideo?: React.CSSProperties;
  classNameImage?: string;
  classNameAudio?: string;
  objectFit?: string;
  hidden?: boolean;
};

export type MakeCommentProps = {
  main?: boolean;
  id: string;
  contentLoading: {
    image: boolean;
    video: boolean;
  };
  commentLoading: boolean;
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  postCollectGif: PostCollectGifState;
  comment: (id: string, main?: boolean) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  setMakePostComment: (e: SetStateAction<MakePostComment[]>) => void;
  makePostComment: MakePostComment;
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
  lensConnected: Profile | undefined;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  index: number;
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
};

export type FilterProps = {
  router: NextRouter;
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

export type PublicationProps = {
  dispatch?: Dispatch<AnyAction>;
  index?: number;
  disabled?: boolean;
  bookmark?: (id: string, main?: boolean) => Promise<void>;
  mirrorChoiceOpen?: boolean[];
  setMirrorChoiceOpen?: (e: SetStateAction<boolean[]>) => void;
  like?: (id: string, hasReacted: boolean, main?: boolean) => Promise<void>;
  comment?: (id: string, main?: boolean) => Promise<void>;
  mirror?: (id: string, main?: boolean) => Promise<void>;
  item: Post;
  router?: NextRouter;
  caretCoord?: {
    x: number;
    y: number;
  };
  setCaretCoord?: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  setMakeComment?: (e: SetStateAction<MakePostComment[]>) => void;
  setMentionProfiles?: (e: SetStateAction<Profile[]>) => void;
  profilesOpen?: boolean[];
  makeComment?: MakePostComment[];
  mentionProfiles?: Profile[];
  setProfilesOpen?: (e: SetStateAction<boolean[]>) => void;
  lensConnected?: Profile | undefined;
  postCollectGif?: PostCollectGifState;
  interactionsLoading?: {
    mirror: boolean;
    bookmark: boolean;
    like: boolean;
    comment: boolean;
    simpleCollect: boolean;
  }[];
  setCommentBoxOpen?: (e: SetStateAction<boolean[]>) => void;
  commentBoxOpen?: boolean[];
  setContentLoading?: (
    e: SetStateAction<{ image: boolean; video: boolean }[]>
  ) => void;
  contentLoading?: { image: boolean; video: boolean }[];
};
