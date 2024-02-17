import { useState } from "react";
import { PublicClient } from "viem";

const useClaim = (
  address: `0x${string}` | undefined,
  publicClient: PublicClient
) => {
  const [milestoneClaimLoading, setMilestoneClaimLoading] =
    useState<boolean>(false);

  const handleClaimMilestone = async () => {
    if (!address) return;
    setMilestoneClaimLoading(true);
    try {
      
    } catch (err: any) {
      console.error(err.message);
    }
    setMilestoneClaimLoading(false);
  };

  return {
    milestoneClaimLoading,
    handleClaimMilestone,
  };
};

export default useClaim;
