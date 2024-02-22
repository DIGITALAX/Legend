import { Grant } from "@/components/Grants/types/grant.types";
import { SetStateAction, useEffect, useState } from "react";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import { LEGEND_MILESTONE_ESCROW_CONTRACT } from "../../../../lib/constants";
import LegendMilestoneEscrow from "./../../../../abi/GrantMilestoneClaimAbi.json";
import { Dispatch } from "redux";
import { getGrant } from "../../../../graphql/subgraph/queries/getAllGrants";
import { setMilestoneClaim } from "../../../../redux/reducers/milestoneClaimSlice";

const useClaim = (
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  edit: Grant | undefined,
  dispatch: Dispatch,
  setEdit: (e: SetStateAction<Grant | undefined>) => void,
  setGrants: (
    e: SetStateAction<
      (Grant & {
        type: string;
      })[]
    >
  ) => void
) => {
  const [milestoneClaimLoading, setMilestoneClaimLoading] =
    useState<boolean>(false);
  const [showFundedHover, setShowFundedHover] = useState<boolean[][]>([]);

  const handleClaimMilestone = async (milestone: number) => {
    if (!address || !edit) return;
    setMilestoneClaimLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: LEGEND_MILESTONE_ESCROW_CONTRACT,
        abi: LegendMilestoneEscrow,
        functionName: "initiateMilestoneClaim",
        chain: polygon,
        args: [Number(edit?.grantId), milestone],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });

      dispatch(
        setMilestoneClaim({
          actionOpen: true,
          actionMilestone: milestone,
          actionCover: edit?.grantMetadata?.milestones?.[milestone - 1]?.cover,
        })
      );

      if (edit) {
        const newGrant = await getGrant(
          parseInt(edit?.pubId, 16),
          parseInt(edit?.profileId, 16)
        );

        setEdit(newGrant);

        setGrants((prev) => {
          const arr = [...prev];

          const index = arr?.findIndex(
            (item) => item?.grantId == edit?.grantId
          );

          arr[index] = newGrant;

          return arr;
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMilestoneClaimLoading(false);
  };

  useEffect(() => {
    if (edit) {
      setShowFundedHover(
        Array.from({ length: 3 }, (_, index) =>
          Array.from(
            { length: edit?.milestones?.[index]?.currencyGoal?.length },
            () => false
          )
        )
      );
    } else {
      setShowFundedHover([]);
    }
  }, [edit]);

  return {
    milestoneClaimLoading,
    handleClaimMilestone,
    showFundedHover,
    setShowFundedHover,
  };
};

export default useClaim;
