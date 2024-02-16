import { useState } from "react";
import { Profile } from "../../../../graphql/generated";

const useFollow = (id: string, lensConnected: Profile | undefined) => {
  const [followLoading, setFollowLoading] = useState<boolean>(false);

  const followProfile = async () => {
    setFollowLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowLoading(false);
  };

  const unfollowProfile = async () => {
    setFollowLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowLoading(false);
  };

  return {
    followLoading,
    followProfile,
    unfollowProfile,
  };
};

export default useFollow;
