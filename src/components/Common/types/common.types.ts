import { Details } from "@/components/Launch/types/launch.types";
import { NextRouter } from "next/router";
import { ChangeEvent, SetStateAction } from "react";
import { Profile } from "../../../../graphql/generated";
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
