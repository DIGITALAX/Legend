import { AnyAction, Dispatch } from "redux";

export type MediaExpandProps = {
  dispatch: Dispatch<AnyAction>;
  image: string;
  type: string;
};

export type ErrorProps = {
  dispatch: Dispatch<AnyAction>;
  message: string;
};

export type ClaimProfileProps = {
  dispatch: Dispatch<AnyAction>;
};

export type IndexProps = {
  message: string;
};
