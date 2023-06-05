import { AnyAction, Dispatch } from "redux";

export type CollectBoxProps = {
  dispatch: Dispatch<AnyAction>;
  index: number;
  collapseNumber: boolean[];
};

export type MirrorBoxProps = {
  dispatch: Dispatch<AnyAction>;
  index: number;
  collapseNumber: boolean[];
};

export type StorefrontBoxProps = {
  dispatch: Dispatch<AnyAction>;
  index: number;
  collapseNumber: boolean[];
};

export type CommentBoxProps = {
  dispatch: Dispatch<AnyAction>;
  index: number;
  collapseNumber: boolean[];
};

export type GrantBoxProps = {
  dispatch: Dispatch<AnyAction>;
  index: number;
  collapseNumber: boolean[];
};
