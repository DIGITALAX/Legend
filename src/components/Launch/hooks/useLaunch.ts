import { ChangeEvent, useState } from "react";
import { isValid, parse, format } from "date-fns";
import uploadPostContent from "../../../../lib/lens/helpers/uploadPostContent";
import onChainPost from "../../../../graphql/lens/mutations/onchainPost";
import { useAccount } from "wagmi";
import { PostInformation } from "../types/launch.types";
import { ethers } from "ethers";
import {
  GRANT_REGISTER_CONTRACT,
  OPEN_ACTION_CONTRACT,
} from "../../../../lib/constants";
import { polygonMumbai } from "viem/chains";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import GrantRegisterAbi from "./../../../../abi/GrantRegisterAbi.json";
import getPublications from "../../../../graphql/lens/queries/publications";
import { LimitType, PublicationType } from "../../../../graphql/generated";
import pollUntilIndexed from "../../../../graphql/lens/queries/indexer";
import validateMetadata from "../../../../graphql/lens/queries/metadata";

const useLaunch = () => {
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  });
  const { address } = useAccount();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const levelArray = useSelector(
    (state: RootState) => state.app.levelArrayReducer.collections
  );
  const [grantStage, setGrantStage] = useState<number>(0);
  const [grantId, setGrantId] = useState<number>();
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [grantRegistered, setGrantRegistered] = useState<boolean>(false);
  const [activateMilestoneLoading, setActivateMilestoneLoading] = useState<
    boolean[]
  >(Array.from({ length: 3 }, () => false));
  const [claimMilestoneLoading, setClaimMilestoneLoading] = useState<boolean[]>(
    Array.from({ length: 3 }, () => false)
  );
  const [grantPosted, setGrantPosted] = useState<boolean>(false);
  const [postInformation, setPostInformation] = useState<PostInformation>({
    title: "",
    description: "",
    coverImage: "",
    tech: "",
    strategy: "",
    experience: "",
    team: "",
    grantees: [],
    splits: [],
    milestones: Array.from({ length: 3 }, () => ({
      description: "",
      amount: 0,
      submit: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ).toDateString(),
      image: "",
    })),
  });
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<(Date | undefined)[]>(
    Array.from(
      { length: 3 },
      () => new Date(new Date().setMonth(new Date().getMonth() + 1))
    )
  );
  const [inputDateValue, setInputDateValue] = useState<string[]>(
    Array.from({ length: 3 }, () => "")
  );
  const [dateOpen, setDateOpen] = useState<boolean[]>(
    Array.from({ length: 3 }, () => false)
  );

  const handleInputDateChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const currentInputs = [...inputDateValue];
    currentInputs[index] = (e.target as HTMLInputElement).value;
    setInputDateValue(currentInputs);
    const date = parse(e.currentTarget.value, "y-MM-dd", new Date());
    const currentDates = [...selectedDate];

    if (isValid(date)) {
      currentDates[index] = date;
      setSelectedDate(currentDates);
      const milestones = [...postInformation?.milestones];
      milestones[index].submit = (e.target as HTMLInputElement).value;
      setPostInformation({
        ...postInformation,
        milestones: milestones,
      });
    }
  };

  const handleDateSelect = (date: Date | undefined, index: number) => {
    const currentDates = [...selectedDate];
    const currentInputs = [...inputDateValue];
    if (date) {
      currentDates[index] = date;
      setSelectedDate(currentDates);
      currentInputs[index] = format(date, "yy-MM-dd");
      setInputDateValue(currentInputs);
      const milestones = [...postInformation?.milestones];
      milestones[index].submit = format(date, "yy-MM-dd");
      setPostInformation({
        ...postInformation,
        milestones: milestones,
      });
    }
  };

  const handleRegisterGrant = async () => {
    setRegisterLoading(true);

    const clientWallet = createWalletClient({
      chain: polygonMumbai,
      transport: custom((window as any).ethereum),
    });

    let simulateContract;
    try {
      const pubId = await getLastPost();

      simulateContract = await publicClient.simulateContract({
        address: GRANT_REGISTER_CONTRACT,
        abi: GrantRegisterAbi,
        args: [
          {
            granteeAddresses: postInformation.grantees,
            splitAmounts: postInformation.splits.map((item) => item * 100),
            amounts: postInformation.milestones.map(
              (item) => item.amount * 10 ** 18
            ),
            submitBy: postInformation.milestones.map((date) =>
              Math.floor(
                new Date(
                  2000 + parseInt(date.submit.split("-")[2]),
                  Number(date.submit.split("-")[1]) - 1,
                  Number(date.submit.split("-")[0])
                ).getTime() / 1000
              )
            ),
            pubId: pubId,
            profileId: parseInt(lensProfile?.id, 16),
          },
        ],
        functionName: "registerGrant",
        chain: polygonMumbai,
        account: address,
      });
    } catch (err: any) {
      console.error(err.message);
      setRegisterLoading(false);
      return;
    }

    const res = await clientWallet.writeContract(simulateContract.request);
    await publicClient.waitForTransactionReceipt({ hash: res });
    setGrantRegistered(true);
    setRegisterLoading(false);
  };

  const handlePostGrant = async () => {
    setPostLoading(true);

    try {
      const contentURIValue = await uploadPostContent(postInformation);
      const metadata = await validateMetadata({
        rawURI: contentURIValue,
      });

      if (!metadata?.data?.validatePublicationMetadata.valid) {
        setPostLoading(false);
        return;
      }

      const encodedData: string = ethers.utils.defaultAbiCoder.encode(
        [
          "uint256[][2]",
          "uint256[][2]",
          "uint256[][2]",
          "uint256[][2]",
          "uint256[][2]",
          "uint256[][2]",
          "address",
        ],
        [
          ...levelArray?.map((item) => [
            item.items.map((value) => Number(value.collectionId)),
            item.items.map((_) => 1),
          ]),
          address,
        ]
      );

      const { data } = await onChainPost({
        contentURI: contentURIValue,
        openActionModules: [
          {
            unknownOpenAction: {
              address: OPEN_ACTION_CONTRACT,
              data: encodedData,
            },
          },
        ],
      });
      if (data?.postOnchain.__typename === "RelaySuccess") {
        const result = await pollUntilIndexed({
          forTxId: data?.postOnchain?.txId,
        });

        if (result === true) {
          setGrantPosted(true);
          setGrantStage(6);
        } else {
          console.error(result);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setImageLoading(true);
    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: (e as any).target.files[0],
      });

      if (response.status !== 200) {
        return;
      } else {
        let cid = await response.json();
        setPostInformation({
          ...postInformation,
          coverImage: String(cid?.cid),
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setImageLoading(false);
  };

  const handleActivateMilestone = async (index: number) => {
    setActivateMilestoneLoading((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = true;
      return newArray;
    });
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setActivateMilestoneLoading((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = false;
      return newArray;
    });
  };

  const handleClaimMilestone = async (index: number) => {
    setClaimMilestoneLoading((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = true;
      return newArray;
    });
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setClaimMilestoneLoading((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = false;
      return newArray;
    });
  };

  const getLastPost = async () => {
    try {
      const data = await getPublications({
        limit: LimitType.Ten,
        where: {
          from: lensProfile?.id,
          publicationTypes: [
            PublicationType.Comment,
            PublicationType.Post,
            PublicationType.Quote,
          ],
        },
      });

      let id: number;
      if (!data || data?.data?.publications.items.length === 0) {
        id = 1;
      } else {
        id =
          parseInt(data?.data?.publications.items[0].id?.split("-")?.[1], 16) +
          1;
      }
      setGrantId(id);
      return id;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return {
    handleInputDateChange,
    handleDateSelect,
    selectedDate,
    inputDateValue,
    dateOpen,
    setDateOpen,
    handleRegisterGrant,
    handlePostGrant,
    postLoading,
    registerLoading,
    grantPosted,
    grantRegistered,
    imageLoading,
    handleImageUpload,
    postInformation,
    setPostInformation,
    handleActivateMilestone,
    handleClaimMilestone,
    activateMilestoneLoading,
    claimMilestoneLoading,
    setGrantStage,
    grantStage,
    grantId,
  };
};

export default useLaunch;
