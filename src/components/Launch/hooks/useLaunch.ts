import { ChangeEvent, useState } from "react";
import { isValid, parse, format } from "date-fns";
import uploadPostContent from "../../../../lib/lens/helpers/uploadPostContent";
import { LevelInfo, PostInformation } from "../types/launch.types";
import { ethers } from "ethers";
import {
  ACCEPTED_TOKENS_MUMBAI,
  LEGEND_OPEN_ACTION_CONTRACT,
} from "../../../../lib/constants";
import { polygonMumbai } from "viem/chains";
import { PublicClient, createWalletClient, custom } from "viem";
import { Profile } from "../../../../graphql/generated";
import { Dispatch } from "redux";
import lensPost from "../../../../lib/graph/helpers/lensPost";

const useLaunch = (
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  profile: Profile | undefined,
  levelArray: LevelInfo[],
  dispatch: Dispatch
) => {
  const [grantStage, setGrantStage] = useState<number>(0);
  const [grantId, setGrantId] = useState<number>();
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [activateMilestoneLoading, setActivateMilestoneLoading] = useState<
    boolean[]
  >(Array.from({ length: 3 }, () => false));
  const [claimMilestoneLoading, setClaimMilestoneLoading] = useState<boolean[]>(
    Array.from({ length: 3 }, () => false)
  );
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
    currencies: [],
    milestones: Array.from({ length: 3 }, () => ({
      description: "",
      currencyAmount: [],
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

  const handlePostGrant = async () => {
    if (!address) return;
    setPostLoading(true);

    try {
      const contentURIValue = await uploadPostContent(postInformation);

      const encodedData: string = ethers.utils.defaultAbiCoder.encode(
        [
          "tuple(tuple(uint256[] collectionIds, uint256[] amounts, uint8 level)[6] levelInfo, uint256[][3] goalToCurrency, address[] acceptedCurrencies, address[] granteeAddresses, uint256[] splitAmounts, uint256[3] submitBys, string uri)",
        ],
        [
          {
            levelInfo: levelArray?.map((item, index: number) => ({
              level: index + 2,
              collectionIds: item?.collectionIds?.map((item) =>
                isNaN(Number(item?.collectionId))
                  ? 1
                  : Number(item?.collectionId)
              ),
              amounts: Array.from(
                { length: item?.collectionIds?.length },
                () => 1
              ),
            })),
            goalToCurrency: postInformation?.milestones?.map((mil) =>
              mil.currencyAmount?.map((cur, index) =>
                index ==
                postInformation.currencies.findIndex(
                  (c) =>
                    c?.toLowerCase() ==
                    ACCEPTED_TOKENS_MUMBAI[3][2]?.toLowerCase()
                )
                  ? (Number(cur?.goal) * 10 ** 6).toString()
                  : (Number(cur?.goal) * 10 ** 18).toString()
              )
            ),
            acceptedCurrencies: postInformation.currencies,
            granteeAddresses: postInformation?.grantees,
            splitAmounts: postInformation?.splits?.map((item) =>
              (Number(item) * 10 ** 18).toString()
            ),
            submitBys: postInformation?.milestones?.map((mil) =>
              Math.floor(new Date(`20${mil.submit}`).getTime() / 1000)
            ),
            uri: contentURIValue?.grantURI,
          },
        ]
      );

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensPost(
        contentURIValue?.postURI!,
        dispatch,
        [
          {
            unknownOpenAction: {
              address: LEGEND_OPEN_ACTION_CONTRACT,
              data: encodedData,
            },
          },
        ],
        address,
        clientWallet,
        publicClient
      );

      setPostInformation({
        title: "",
        description: "",
        coverImage: "",
        tech: "",
        strategy: "",
        experience: "",
        team: "",
        grantees: [],
        splits: [],
        currencies: [],
        milestones: Array.from({ length: 3 }, () => ({
          description: "",
          currencyAmount: [],
          submit: new Date(
            new Date().setMonth(new Date().getMonth() + 1)
          ).toDateString(),
          image: "",
        })),
      });
      setGrantStage(6);
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

  return {
    handleInputDateChange,
    handleDateSelect,
    selectedDate,
    inputDateValue,
    dateOpen,
    setDateOpen,
    handlePostGrant,
    postLoading,
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
