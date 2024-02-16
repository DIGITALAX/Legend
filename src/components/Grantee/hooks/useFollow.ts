import { useState } from "react";
import { Profile } from "../../../../graphql/generated";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import lensFollow from "../../../../lib/lens/helpers/lensFollow";
import { Dispatch } from "redux";
import refetchProfile from "../../../../lib/lens/helpers/refetchProfile";
import lensUnfollow from "../../../../lib/lens/helpers/lensUnfollow";

const useFollow = (
  id: string,
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  address: `0x${string}`,
  publicClient: PublicClient
) => {
  const [followLoading, setFollowLoading] = useState<boolean>(false);

  const followProfile = async () => {
    if (!lensConnected?.id) return;
    setFollowLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensFollow(
        id,
        dispatch,
        undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowLoading(false);
  };

  const unfollowProfile = async () => {
    if (!lensConnected?.id) return;
    setFollowLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensUnfollow(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
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
