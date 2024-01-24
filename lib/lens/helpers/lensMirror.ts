import { omit } from "lodash";
import { Action, Dispatch } from "redux";
import { polygon } from "viem/chains";
import { PublicClient, WalletClient } from "viem";
import mirrorPost from "../../../graphql/lens/mutations/mirror";
import broadcast from "../../../graphql/lens/queries/broadcast";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import handleIndexCheck from "../../graph/helpers/handleIndexCheck";
import { LENS_HUB_PROXY } from "../../constants";
import LensHubProxy from "./../../../abi/LensHubProxy.json";

const lensMirror = async (
  mirrorOn: string,
  dispatch: Dispatch<Action>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient
): Promise<void> => {
  const data = await mirrorPost({
    mirrorOn,
  });

  const typedData = data?.data?.createOnchainMirrorTypedData?.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Mirror",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.data?.createOnchainMirrorTypedData?.id,
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
      functionName: "mirror",
      chain: polygon,
      args: [
        {
          profileId: typedData?.value.profileId,
          metadataURI: typedData?.value.metadataURI,
          pointedProfileId: typedData?.value.pointedProfileId,
          pointedPubId: typedData?.value.pointedPubId,
          referrerProfileIds: typedData?.value.referrerProfileIds,
          referrerPubIds: typedData?.value.referrerPubIds,
          referenceModuleData: typedData?.value.referenceModuleData,
        },
      ],
      account: address,
    });
    const res = await clientWallet.writeContract(request);
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: "Indexing Interaction",
      })
    );
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

export default lensMirror;
