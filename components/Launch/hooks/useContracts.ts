import {
  FACTORY_CONTRACT_MUMBAI,
  LENS_HUB_PROXY_ADDRESS_MUMBAI,
} from "@/lib/constants";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import LegendFactoryAbi from "./../../../abi/LegendFactory.json";
import { useEffect, useState } from "react";
import { waitForTransaction } from "@wagmi/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { profilePublications } from "@/graphql/lens/query/getPublications";
import nextHex from "@/lib/lens/helpers/nextHex";
import { useRouter } from "next/router";
import { setContractValues } from "@/redux/reducers/contractValuesSlice";
import { setPubId } from "@/redux/reducers/pubIdSlice";

const useContracts = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pubId = useSelector(
    (state: RootState) => state.app.pubIdReducer?.pubId
  );
  const profileId = useSelector(
    (state: RootState) => state.app.profileReducer.profile?.id
  );
  const postValues = useSelector(
    (state: RootState) => state.app.postValuesReducer.value
  );
  const NFTValues = useSelector(
    (state: RootState) => state.app.NFTImageArrayReducer.value
  );
  const [createContractsLoading, setCreateContractsLoading] =
    useState<boolean>(false);

  const { config } = usePrepareContractWrite({
    address: FACTORY_CONTRACT_MUMBAI,
    abi: LegendFactoryAbi,
    args: [
      pubId,
      profileId && parseInt(profileId, 16),
      {
        lensHubProxyAddress: LENS_HUB_PROXY_ADDRESS_MUMBAI,
        legendFactoryAddress: FACTORY_CONTRACT_MUMBAI,
        URIArrayValue: NFTValues,
        grantNameValue: postValues.title,
        editionAmountValue: postValues.editionAmount,
      },
    ],
    functionName: "createContracts",
    enabled: Boolean(pubId),
  });

  const { writeAsync } = useContractWrite(config);

  const getLastPost = async () => {
    try {
      const { data } = await profilePublications({
        profileId,
        publicationTypes: ["POST"],
        limit: 1,
      });
      if (!data || !data || data?.publications?.items?.length < 1) {
        dispatch(setPubId(1));
      } else {
        const next = nextHex(data?.publications?.items[0]?.id.split("-")[1]);
        dispatch(setPubId(parseInt(next, 16)));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const createContracts = async () => {
    setCreateContractsLoading(true);
    try {
      const tx = await writeAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      if (res.status === "success") {
        dispatch(setContractValues(res.logs.map((log) => log.address)));
        // for (let i = 0; i < addresses.length; i++) {
        //   await fetch("/api/etherscan", {
        //     method: "POST",
        //     body: JSON.stringify({
        //       address: addresses[i],
        //     }),
        //   });
        // }
      } else {
        // cause an error here
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCreateContractsLoading(false);
  };

  useEffect(() => {
    if (router.asPath.includes("launch") && profileId) {
      getLastPost();
    }
  }, [profileId, router.asPath]);

  return {
    createContractsLoading,
    createContracts,
  };
};

export default useContracts;
