import { useEffect, useState } from "react";
import generateChallenge from "../../../../graphql/lens/queries/challenge";
import { useAccount, useSignMessage } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { setWalletConnected } from "../../../../redux/reducers/walletConnectedSlice";
import { splitSignature } from "ethers/lib/utils.js";
import LensHubProxy from "./../../../../abi/LensHubProxy.json";
import authenticate from "../../../../graphql/lens/mutations/authenticate";
import { omit } from "lodash";
import {
  getAuthenticationToken,
  isAuthExpired,
  refreshAuth,
  removeAuthenticationToken,
  setAuthenticationToken,
} from "../../../../lib/lens/utils";
import { setLensConnected } from "../../../../redux/reducers/lensProfileSlice";
import getProfiles from "../../../../graphql/lens/queries/profiles";
import { Profile } from "../../../../graphql/generated";
import createProfile from "../../../../graphql/lens/mutations/createProfile";
import { RootState } from "../../../../redux/store";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";
import { profile } from "console";
import profileManager from "../../../../graphql/lens/mutations/manager";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygonMumbai } from "viem/chains";
import { LENS_HUB_PROXY } from "../../../../lib/constants";

const useSignIn = () => {
  const dispatch = useDispatch();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  });
  const { signMessageAsync } = useSignMessage();
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const [createProfileLoading, setCreateProfileLoading] =
    useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const cartAnim = useSelector(
    (state: RootState) => state.app.cartAnimReducer.value
  );

  const createProfileWithHandle = async () => {
    setCreateProfileLoading(true);
    try {
      const profile = await createProfile({
        handle: "emmaja",
        to: address,
      });

      console.log(profile?.data?.createProfileWithHandle);
    } catch (err: any) {
      console.error(err.message);
    }
    setCreateProfileLoading(false);
  };

  const handleLensSignIn = async () => {
    setSignInLoading(true);

    // await createProfileWithHandle();

    try {
      const profile = await getProfiles({
        where: {
          ownedBy: [address],
        },
      });
      const challengeResponse = await generateChallenge({
        for: profile?.data?.profiles?.items?.[
          profile?.data?.profiles?.items?.length - 1
        ].id,
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
        dispatch(
          setLensConnected(
            profile?.data?.profiles?.items?.[
              profile?.data?.profiles?.items?.length - 1
            ] as Profile
          )
        );
        const { data } = await profileManager({
          approveSignless: true,
        });

        const clientWallet = createWalletClient({
          chain: polygonMumbai,
          transport: custom((window as any).ethereum),
        });

        const signature: any = await clientWallet.signTypedData({
          domain: omit(
            data?.createChangeProfileManagersTypedData.typedData.domain,
            ["__typename"]
          ),
          types: omit(
            data?.createChangeProfileManagersTypedData.typedData.types,
            ["__typename"]
          ),
          primaryType: "ChangeDelegatedExecutorsConfig" as any,
          message: omit(
            data?.createChangeProfileManagersTypedData.typedData.value,
            ["__typename"]
          ),
          account: address as `0x${string}`,
        });

        const { v, r, s } = splitSignature(signature);

        const { request } = await publicClient.simulateContract({
          address: LENS_HUB_PROXY,
          abi: LensHubProxy,
          functionName: "changeDelegatedExecutorsConfigWithSig",
          chain: polygonMumbai,
          args: [
            data?.createChangeProfileManagersTypedData.typedData.value
              .delegatorProfileId,
            data?.createChangeProfileManagersTypedData.typedData.value
              .delegatedExecutors,
            data?.createChangeProfileManagersTypedData.typedData.value
              .approvals,
            data?.createChangeProfileManagersTypedData.typedData.value
              .configNumber,
            data?.createChangeProfileManagersTypedData.typedData.value
              .switchToGivenConfig,
            {
              signer: address,
              v,
              r,
              s,
              deadline:
                data?.createChangeProfileManagersTypedData.typedData.value
                  .deadline,
            },
          ],
          account: address,
        });
        const res = await clientWallet.writeContract(request);
        await publicClient.waitForTransactionReceipt({ hash: res });
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
      const profile = await getProfiles({
        where: {
          ownedBy: [address],
        },
      });
      if (profile?.data?.profiles?.items?.length !== null) {
        dispatch(
          setLensConnected(
            profile?.data?.profiles?.items?.[
              profile?.data?.profiles?.items?.length - 1
            ] as Profile
          )
        );
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
  }, [isConnected]);

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
    createProfileWithHandle,
    createProfileLoading,
    checkoutOpen,
    setCheckoutOpen,
  };
};

export default useSignIn;
