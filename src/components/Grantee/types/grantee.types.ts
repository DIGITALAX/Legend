import { NextRouter } from "next/router";
import { Profile } from "../../../../graphql/generated";

export type AccountProps = {
  profile: Profile | undefined;
  granteeLoading: boolean;
  followProfile: () => Promise<void>;
  unfollowProfile: () => Promise<void>;
  followLoading: boolean;
};
