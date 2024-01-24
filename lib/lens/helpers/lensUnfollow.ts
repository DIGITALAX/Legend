import { omit } from "lodash";
import LensHubProxy from "./../../../abi/LensHubProxy.json";
import { Action, Dispatch } from "redux";
import { WalletClient, PublicClient } from "viem";
import { polygon } from "viem/chains";
import broadcast from "../../../graphql/lens/queries/broadcast";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import handleIndexCheck from "../../graph/helpers/handleIndexCheck";
import { LENS_HUB_PROXY } from "../../constants";
import unfollow from "../../../graphql/lens/mutations/unfollow";

const lensUnfollow = async (
  id: string,
  dispatch: Dispatch<Action>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient
): Promise<void> => {
  const { data } = await unfollow({
    unfollow: [id],
  });

  const typedData = data?.createUnfollowTypedData.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Unfollow",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.createUnfollowTypedData?.id,
    signature,
  });

  if (broadcastResult?.data?.broadcastOnchain?.__typename === "RelaySuccess") {
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: "Indexing Interaction",
      })
    );

    await handleIndexCheck(
      {
        forTxId: broadcastResult?.data?.broadcastOnchain?.txId,
      },
      dispatch
    );
  } else {
    const { request } = await publicClient.simulateContract({
      address: LENS_HUB_PROXY,
      abi: LensHubProxy,
      functionName: "unfollow",
      chain: polygon,
      args: [
        typedData?.value?.unfollowerProfileId,
        typedData?.value?.idsOfProfilesToUnfollow,
      ],
      account: address,
    });
    const res = await clientWallet.writeContract(request);
    const tx = await publicClient.waitForTransactionReceipt({ hash: res });

    await handleIndexCheck(
      {
        forTxHash: tx.transactionHash,
      },
      dispatch
    );
  }

  setTimeout(() => {
    dispatch(
      setIndexer({
        actionOpen: false,
        actionMessage: undefined,
      })
    );
  }, 3000);
};

export default lensUnfollow;
