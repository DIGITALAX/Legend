import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddress,
  getAuthenticationToken,
  isAuthExpired,
  refreshAuth,
  removeAuthenticationToken,
  setAddress,
  setAuthenticationToken,
} from "@/lib/lens/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setProfile } from "@/redux/reducers/profileSlice";
import { setAuthStatus } from "@/redux/reducers/authSlice";
import authenticate from "@/graphql/lens/mutate/authenticate";
import generateChallenge from "@/graphql/lens/query/generateChallenge";
import getDefaultProfile from "@/graphql/lens/query/getDefaultProfile";
import { setNoHandle } from "@/redux/reducers/noHandleSlice";
import { UseSignInResults } from "../types/layout.types";
import checkDispatcher from "@/lib/lens/helpers/checkDispatcher";
import { RootState } from "@/redux/store";

const useSignIn = (): UseSignInResults => {
  const { openConnectModal } = useConnectModal();
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const [connected, setConnected] = useState<boolean>(false);
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const profileId = useSelector(
    (state: RootState) => state.app.profileReducer.profile?.id
  );

  const { signMessageAsync } = useSignMessage({
    onError() {
      dispatch(setAuthStatus(false));
    },
  });

  const handleConnect = (): void => {
    openConnectModal && openConnectModal();
    dispatch(
      setNoHandle({
        actionValue: false,
        actionMessage: "",
      })
    );
  };

  const handleLensSignIn = async (): Promise<void> => {
    setSignInLoading(true);
    try {
      const challengeResponse = await generateChallenge(address);
      const signature = await signMessageAsync({
        message: challengeResponse.data.challenge.text,
      });
      const accessTokens = await authenticate(
        address as string,
        signature as string
      );
      if (accessTokens) {
        setAuthenticationToken({ token: accessTokens.data.authenticate });
        setAddress(address as string);
        const profile = await getDefaultProfile(address);
        if (profile?.data?.defaultProfile) {
          dispatch(
            setNoHandle({
              actionValue: false,
              actionMessage: "",
            })
          );
          dispatch(setProfile(profile?.data?.defaultProfile));
          dispatch(setAuthStatus(true));
        } else {
          dispatch(
            setNoHandle({
              actionValue: true,
              actionMessage:
                "Own Your Digital Roots. Claim A Lens Handle to Sign In & Collect.",
            })
          );
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSignInLoading(false);
  };

  const handleRefreshProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile(address);
      if (profile?.data?.defaultProfile !== null) {
        dispatch(setProfile(profile?.data?.defaultProfile));
        dispatch(setAuthStatus(true));
      } else {
        dispatch(setAuthStatus(false));
        removeAuthenticationToken();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const handleAuthentication = async () => {
      setConnected(isConnected);
      const newAddress = getAddress();

      if (
        (newAddress && newAddress?.replace(/^"|"$/g, "") === address) ||
        (!newAddress && address)
      ) {
        const token = getAuthenticationToken();
        setAddress(address as string);
        if (isConnected && !token) {
          dispatch(setProfile(undefined));
          removeAuthenticationToken();
        } else if (isConnected && token) {
          if (isAuthExpired(token?.exp)) {
            const refreshedAccessToken = await refreshAuth(); // await the refreshAuth promise
            if (!refreshedAccessToken) {
              dispatch(setProfile(undefined));
              removeAuthenticationToken();
            }
          }
          await handleRefreshProfile(); // await the handleRefreshProfile promise
        }
      } else if (isConnected && address !== newAddress) {
        dispatch(setProfile(undefined));
        removeAuthenticationToken();
      }
    };

    handleAuthentication(); // Call the inner async function
  }, [isConnected]);

  useEffect(() => {
    checkDispatcher(dispatch, profileId);
  }, [profileId]);

  return {
    handleConnect,
    handleLensSignIn,
    connected,
    signInLoading,
  };
};

export default useSignIn;
