import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygonMumbai } from "viem/chains";
import { useAccount } from "wagmi";
import {
  GRANT_MILESTONE_CLAIM_CONTRACT,
  GRANT_REGISTER_CONTRACT,
} from "../../../../lib/constants";
import GrantMilestoneClaimAbi from "./../../../../abi/GrantMilestoneClaimAbi.json";
import GrantRegisterAbi from "./../../../../abi/GrantRegisterAbi.json";
import { setGrantee } from "../../../../redux/reducers/granteeSlice";

const useMilestone = () => {
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  });
  const dispatch = useDispatch();
  const { address } = useAccount();
  const [milestoneClaimLoading, setMilestoneClaimLoading] =
    useState<boolean>(false);

  const handleIsGrantee = async () => {
    try {
      const result = await publicClient.readContract({
        address: GRANT_REGISTER_CONTRACT,
        abi: GrantRegisterAbi,
        args: [address],
        functionName: "getGrantIdentifier",
        account: address,
      });

      if (result !== 0) {
        dispatch(setGrantee(true));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleInitiateUMA = async (id: string) => {
    setMilestoneClaimLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });
      let simulateContract;
      try {
        simulateContract = await publicClient.simulateContract({
          address: GRANT_MILESTONE_CLAIM_CONTRACT,
          abi: GrantMilestoneClaimAbi,
          args: [id],
          functionName: "initiateMilestoneClaim",
          chain: polygonMumbai,
          account: address,
        });
      } catch (err: any) {
        console.error(err.message);
        setMilestoneClaimLoading(false);
        return;
      }

      const res = await clientWallet.writeContract(simulateContract.request);
      await publicClient.waitForTransactionReceipt({ hash: res });
    } catch (err: any) {
      console.error(err.message);
    }
    setMilestoneClaimLoading(false);
  };

  const handleClaimMilestone = async (id: string) => {
    setMilestoneClaimLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });
      let simulateContract;
      try {
        simulateContract = await publicClient.simulateContract({
          address: GRANT_MILESTONE_CLAIM_CONTRACT,
          abi: GrantMilestoneClaimAbi,
          args: [id],
          functionName: "claimVerifiedMilestone",
          chain: polygonMumbai,
          account: address,
        });
      } catch (err: any) {
        setMilestoneClaimLoading(false);
        console.error(err.message);
        return;
      }

      const res = await clientWallet.writeContract(simulateContract.request);
      await publicClient.waitForTransactionReceipt({ hash: res });
    } catch (err: any) {
      console.error(err.message);
    }
    setMilestoneClaimLoading(false);
  };

  useEffect(() => {
    handleIsGrantee();
  }, []);

  return {
    handleClaimMilestone,
    handleInitiateUMA,
    milestoneClaimLoading,
  };
};

export default useMilestone;
