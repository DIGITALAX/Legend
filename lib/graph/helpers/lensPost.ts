import { omit } from "lodash";
import LensHubProxy from "./../../../abi/LensHubProxy.json";
import { Action, Dispatch } from "redux";
import { polygon } from "viem/chains";
import { PublicClient, WalletClient } from "viem";
import { InputMaybe, OpenActionModuleInput } from "../../../graphql/generated";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import { LENS_HUB_PROXY } from "../../constants";
import handleIndexCheck from "./handleIndexCheck";
import { setErrorModal } from "../../../redux/reducers/errorModalSlice";
import validateMetadata from "../../../graphql/lens/queries/metadata";
import cleanCollect from "./cleanCollect";
import postOnChain from "../../../graphql/lens/mutations/onchainPost";
import broadcast from "../../../graphql/lens/queries/broadcast";

const lensPost = async (
  contentURI: string,
  dispatch: Dispatch<Action>,
  openActionModules: InputMaybe<OpenActionModuleInput[]> | undefined,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  closeBox?: () => void
): Promise<void> => {
  if (
    openActionModules &&
    openActionModules?.[0]?.hasOwnProperty("collectOpenAction") &&
    openActionModules?.[0]?.collectOpenAction?.hasOwnProperty(
      "simpleCollectOpenAction"
    ) &&
    openActionModules?.[0]?.collectOpenAction?.simpleCollectOpenAction
  ) {
    openActionModules = cleanCollect(openActionModules);
  } else {
    openActionModules = [
      {
        collectOpenAction: {
          simpleCollectOpenAction: {
            followerOnly: false,
          },
        },
      },
    ];
  }

  const metadata = await validateMetadata({
    rawURI: contentURI,
  });

  if (!metadata?.data?.validatePublicationMetadata.valid) {
    dispatch(
      setErrorModal({
        actionValue: true,
        actionMessage:
          "Something went wrong indexing your interaction. Try again?",
      })
    );
    return;
  }

  const data = await postOnChain({
    contentURI,
    openActionModules,
  });

  const typedData = data?.data?.createOnchainPostTypedData?.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Post",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.data?.createOnchainPostTypedData?.id,
    signature,
  });

  if (broadcastResult?.data?.broadcastOnchain?.__typename === "RelaySuccess") {
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: "Indexing Interaction",
      })
    );
    closeBox && closeBox();
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
      functionName: "post",
      chain: polygon,
      args: [
        {
          profileId: typedData?.value.profileId,
          contentURI: typedData?.value.contentURI,
          actionModules: typedData?.value?.actionModules,
          actionModulesInitDatas: typedData?.value?.actionModulesInitDatas,
          referenceModule: typedData?.value?.referenceModule,
          referenceModuleInitData: typedData?.value?.referenceModuleInitData,
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
    closeBox && closeBox();
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

export default lensPost;
