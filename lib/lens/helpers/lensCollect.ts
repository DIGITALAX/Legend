import { FetchResult } from "@apollo/client";
import { AnyAction, Dispatch } from "redux";
import { PublicClient, WalletClient } from "viem";
import {
  ActOnOpenActionInput,
  BroadcastOnchainMutation,
} from "../../../graphql/generated";
import actOn, {
  legacyCollectPost,
} from "../../../graphql/lens/mutations/actOn";
import LensHubProxy from "./../../../abi/LensHubProxy.json";
import broadcast from "../../../graphql/lens/queries/broadcast";
import { omit } from "lodash";
import handleIndexCheck from "../../graph/helpers/handleIndexCheck";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import { LENS_HUB_PROXY } from "../../constants";
import { polygon, polygonMumbai } from "viem/chains";

const lensCollect = async (
  id: string,
  type: string,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  act?: ActOnOpenActionInput
): Promise<void> => {
  let broadcastResult: FetchResult<BroadcastOnchainMutation>,
    functionName: string,
    args: any[];

  if (
    type === "SimpleCollectOpenActionSettings" ||
    type === "MultirecipientFeeCollectOpenActionSettings" ||
    type === "SimpleCollectOpenActionModule" ||
    type === "MultirecipientFeeCollectOpenActionModule" ||
    act
  ) {
    const { data } = await actOn({
      for: id,
      actOn: act || {
        simpleCollectOpenAction:
          type === "SimpleCollectOpenActionSettings" ||
          type === "SimpleCollectOpenActionModule"
            ? true
            : undefined,
        multirecipientCollectOpenAction:
          type === "MultirecipientFeeCollectOpenActionSettings" ||
          type === "MultirecipientFeeCollectOpenActionModule"
            ? true
            : undefined,
      },
    });

    const typedData = data?.createActOnOpenActionTypedData.typedData;

    const signature = await clientWallet.signTypedData({
      domain: omit(typedData?.domain, ["__typename"]),
      types: omit(typedData?.types, ["__typename"]),
      primaryType: "Act",
      message: omit(typedData?.value, ["__typename"]),
      account: address as `0x${string}`,
    });

    broadcastResult = await broadcast({
      id: data?.createActOnOpenActionTypedData?.id,
      signature,
    });

    functionName = "act";
    args = [
      {
        publicationActedProfileId: parseInt(
          typedData?.value.publicationActedProfileId,
          16
        ),
        publicationActedId: parseInt(typedData?.value.publicationActedId, 16),
        actorProfileId: parseInt(typedData?.value.actorProfileId, 16),
        referrerProfileIds: typedData?.value.referrerProfileIds,
        referrerPubIds: typedData?.value.referrerPubIds,
        actionModuleAddress: typedData?.value.actionModuleAddress,
        actionModuleData: typedData?.value.actionModuleData,
      },
    ];
  } else {
    const { data } = await legacyCollectPost({
      on: id,
    });

    const typedData = data?.createLegacyCollectTypedData.typedData;

    const signature = await clientWallet.signTypedData({
      domain: omit(typedData?.domain, ["__typename"]),
      types: omit(typedData?.types, ["__typename"]),
      primaryType: "CollectLegacy",
      message: omit(typedData?.value, ["__typename"]),
      account: address as `0x${string}`,
    });

    broadcastResult = await broadcast({
      id: data?.createLegacyCollectTypedData?.id,
      signature,
    });

    functionName = "collectLegacy";
    args = [
      {
        publicationCollectedProfileId:
          typedData?.value.publicationCollectedProfileId,
        publicationCollectedId: typedData?.value.publicationCollectedId,
        collectorProfileId: typedData?.value.collectorProfileId,
        referrerProfileId: typedData?.value.referrerProfileId,
        referrerPubId: typedData?.value.referrerPubId,
        collectModuleData: typedData?.value.collectModuleData,
      },
    ];
  }

  if (broadcastResult?.data?.broadcastOnchain?.__typename === "RelaySuccess") {
    await handleIndexCheck(
      {
        forTxId: broadcastResult?.data?.broadcastOnchain.txId,
      },
      dispatch
    );
  } else {
    const { request } = await publicClient.simulateContract({
      address: LENS_HUB_PROXY,
      abi: LensHubProxy,
      functionName,
      chain: polygonMumbai,
      args,
      account: address,
    });
    const res = await clientWallet.writeContract(request);
    const tx = await publicClient.waitForTransactionReceipt({ hash: res });
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: "Indexing Interaction",
      })
    );

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

export default lensCollect;
