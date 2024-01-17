import { useEffect, useState } from "react";
import generateChallenge from "../../../../graphql/lens/queries/challenge";
import { useAccount, useSignMessage } from "wagmi";
import { useSelector } from "react-redux";
import { setWalletConnected } from "../../../../redux/reducers/walletConnectedSlice";
import {
  getAuthenticationToken,
  isAuthExpired,
  refreshAuth,
  removeAuthenticationToken,
  setAuthenticationToken,
} from "../../../../lib/lens/utils";
import { setLensConnected } from "../../../../redux/reducers/lensProfileSlice";
import { Profile } from "../../../../graphql/generated";
import { RootState } from "../../../../redux/store";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";
import { Dispatch } from "redux";
import authenticate from "../../../../graphql/lens/mutations/authenticate";
import getDefaultProfile from "../../../../graphql/lens/queries/defaultProfile";
import { setClaimProfile } from "../../../../redux/reducers/claimProfileSlice";

const useSignIn = (dispatch: Dispatch, lensConnected: Profile | undefined) => {
  const { signMessageAsync } = useSignMessage();
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const cartAnim = useSelector(
    (state: RootState) => state.app.cartAnimReducer.value
  );

  const handleLensSignIn = async () => {
    setSignInLoading(true);
    try {
      const profile = await getDefaultProfile(
        {
          for: address,
        },
        lensConnected?.id
      );
      if (profile?.data?.defaultProfile?.id) {
        const challengeResponse = await generateChallenge({
          for: profile?.data?.defaultProfile?.id,
          signedBy: address,
        });
        const signature = await signMessageAsync({
          message: challengeResponse.data?.challenge.text!,
        });
        const accessTokens = await authenticate({
          id: challengeResponse.data?.challenge.id,
          signature: signature,
        });
        if (accessTokens) {
          setAuthenticationToken({ token: accessTokens.data?.authenticate! });
          dispatch(setLensConnected(profile?.data?.defaultProfile as Profile));
        }
      } else {
        dispatch(setLensConnected(undefined));
        dispatch(setClaimProfile(true));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSignInLoading(false);
  };

  useEffect(() => {
    dispatch(setWalletConnected(isConnected));
  }, [isConnected, address]);

  const handleRefreshProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile(
        {
          for: address,
        },
        lensConnected?.id
      );
      if (profile?.data?.defaultProfile) {
        dispatch(setLensConnected(profile?.data?.defaultProfile as Profile));
      } else {
        removeAuthenticationToken();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const handleAuthentication = async () => {
      const token = getAuthenticationToken();
      if (isConnected && !token) {
        dispatch(setLensConnected(undefined));
        removeAuthenticationToken();
      } else if (isConnected && token) {
        if (isAuthExpired(token?.exp)) {
          const refreshedAccessToken = await refreshAuth();
          if (!refreshedAccessToken) {
            removeAuthenticationToken();
          }
        }
        await handleRefreshProfile();
      }
    };

    handleAuthentication();
    dispatch(setWalletConnected(isConnected));
  }, [isConnected, address]);

  useEffect(() => {
    if (cartAnim) {
      setTimeout(() => {
        dispatch(setCartAnim(false));
      }, 3000);
    }
  }, [cartAnim]);

  return {
    handleLensSignIn,
    signInLoading,
    checkoutOpen,
    setCheckoutOpen,
  };
};

export default useSignIn;
