import { useEffect, useState } from "react";
import { setLevelArray } from "../../../../redux/reducers/levelArraySlice";
import { getAllCollections } from "../../../../graphql/subgraph/queries/getAllCollections";
import { setAvailableCollections } from "../../../../redux/reducers/availableCollectionsSlice";
import { Profile } from "../../../../graphql/generated";
import getProfile from "../../../../graphql/lens/queries/profile";
import {
  LevelInfo,
  OracleData,
  PrintItem,
  PrintType,
} from "../types/launch.types";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";
import pickRandomItem from "../../../../lib/graph/helpers/pickRandomItem";
import cachedProfiles from "../../../../lib/graph/helpers/cachedProfiles";
import {
  ACCEPTED_TOKENS_MUMBAI,
  DIGITALAX_PROFILE_ID_LENS,
} from "../../../../lib/constants";
import { setCachedProfiles } from "../../../../redux/reducers/cachedProfilesSlice";
import { getOracleData } from "../../../../graphql/subgraph/queries/getOracleData";
import { setOracleData } from "../../../../redux/reducers/oracleDataSlice";
import { Dispatch } from "redux";

const useLevelItems = (
  dispatch: Dispatch,
  allCollections:
    | {
        [key: string]: PrintItem[];
      }
    | undefined,
  profiles:
    | {
        [key: string]: Profile;
      }
    | undefined,
  oracleData: OracleData[],
  levelItems: LevelInfo[]
) => {
  const [allCollectionsLoading, setAllCollectionsLoading] =
    useState<boolean>(false);
  const [indexes, setIndexes] = useState<
    {
      levelIndex: number;
      imageIndex: number;
      rate: number;
      currency: string;
      price: number[];
      priceIndex: number;
      itemIndex: number;
    }[]
  >(
    Array.from({ length: 7 }, (_, index) => ({
      levelIndex: index,
      imageIndex: 0,
      rate: 0,
      currency: "USDT",
      priceIndex: 0,
      price: Array.from({ length: 3 }, () => 0),
      itemIndex: 0,
    }))
  );

  const getAllAvailableCollections = async () => {
    setAllCollectionsLoading(true);
    try {
      const { data } = await getAllCollections();
      let profileCache: { [key: string]: Profile } = {};

      if (!profiles || typeof profiles !== "object") {
        profileCache = (await cachedProfiles()) as { [key: string]: Profile };
      } else {
        profileCache = profiles;
      }

      const collectionPromises = data?.collectionCreateds?.map(
        async (obj: {
          collectionId: string;
          uri: string;
          prices: string[];
          printType: string;
          fulfiller: string;
        }) => {
          const uri: {
            images: string[];
            description: string;
            title: string;
            profileId: string;
            tags: string[];
            prompt: string;
            microbrandCover: string;
          } = await fetchIpfsJson((obj.uri as any)?.split("ipfs://")[1]);
          let profile: Profile = profileCache[DIGITALAX_PROFILE_ID_LENS];

          if (uri?.profileId) {
            if (!profileCache[uri.profileId]) {
              const { data } = await getProfile({
                forProfileId: uri.profileId,
              });
              profileCache[uri.profileId] = data?.profile?.id;
            }
            profile = profileCache[uri.profileId];
          }

          const modifiedObj = {
            ...obj,
            uri: {
              ...uri,
              profile,
            },
          };

          return modifiedObj;
        }
      );

      dispatch(setCachedProfiles(profileCache));

      const promised = await Promise.all(collectionPromises);

      const categorizedCollections: { [key: string]: PrintItem[] } = {
        [PrintType.Sticker]: [],
        [PrintType.Poster]: [],
        [PrintType.Shirt]: [],
        [PrintType.Hoodie]: [],
      };
      promised?.forEach((item) => {
        categorizedCollections[item.printType].push(item);
      });

      dispatch(setAvailableCollections(categorizedCollections));
    } catch (err: any) {
      console.error(err.message);
    }
    setAllCollectionsLoading(false);
  };

  const handleShuffleCollectionLevels = () => {
    const levelArray: LevelInfo[] = [];

    for (let level = 2; level <= 7; level++) {
      const levelObj: LevelInfo = { level, items: [] };
      switch (level) {
        case 2:
          levelObj.items.push(
            pickRandomItem(allCollections?.[PrintType.Sticker]!)
          );
          break;
        case 3:
          levelObj.items.push(
            pickRandomItem(allCollections?.[PrintType.Poster]!)
          );
          break;
        case 4:
          levelObj.items.push(
            pickRandomItem(allCollections?.[PrintType.Shirt]!)
          );
          break;
        case 5:
          levelObj.items.push(
            pickRandomItem(allCollections?.[PrintType.Hoodie]!)
          );
          break;
        case 6:
          levelObj.items.push(
            pickRandomItem(allCollections?.[PrintType.Sticker]!),
            pickRandomItem(allCollections?.[PrintType.Poster]!),
            pickRandomItem(allCollections?.[PrintType.Hoodie]!),
            pickRandomItem(allCollections?.[PrintType.Shirt]!)
          );
          break;
        case 7:
          levelObj.items.push(
            pickRandomItem(allCollections?.[PrintType.Sticker]!),
            pickRandomItem(allCollections?.[PrintType.Sticker]!),
            pickRandomItem(allCollections?.[PrintType.Poster]!),
            pickRandomItem(allCollections?.[PrintType.Poster]!),
            pickRandomItem(allCollections?.[PrintType.Shirt]!),
            pickRandomItem(allCollections?.[PrintType.Shirt]!),
            pickRandomItem(allCollections?.[PrintType.Hoodie]!)
          );
          break;
      }
      levelArray?.push(levelObj);
    }

    const rate = oracleData?.find(
      (oracle) =>
        oracle.currency ===
        ACCEPTED_TOKENS_MUMBAI.find((item) => item[1] === "USDT")?.[2]
    )?.rate;

    setIndexes(
      Array.from({ length: 7 }, (_, index: number) => ({
        levelIndex: index,
        imageIndex: 0,
        rate: Number(rate),
        currency: "USDT",
        priceIndex: 0,
        price:
          index === 0
            ? [10 ** 18]
            : levelArray[index - 1]?.items?.map((item) =>
                Number(item.prices[0])
              ),
        itemIndex: 0,
      }))
    );

    dispatch(setLevelArray(levelArray));
  };

  const handleOracles = async (): Promise<void> => {
    try {
      const { data } = await getOracleData();

      dispatch(setOracleData(data?.currencyAddeds));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleChangeCurrency = (
    levelIndex: number,
    itemIndex: number,
    priceIndex: number,
    checkoutCurrency: string
  ): void => {
    const items = [...indexes];
    items[levelIndex].currency = checkoutCurrency;
    items[levelIndex].priceIndex = priceIndex;
    if (levelIndex != 0) {
      items[levelIndex].price[priceIndex] = Number(
        levelItems[levelIndex - 1].items[itemIndex].prices[priceIndex]
      );
    }

    items[levelIndex].rate = Number(
      oracleData?.find(
        (oracle) =>
          oracle.currency ===
          ACCEPTED_TOKENS_MUMBAI.find(
            (item) => item[1] === checkoutCurrency
          )?.[2]
      )?.rate
    );
    setIndexes(items);
  };

  const handleChangeImage = (levelIndex: number, imageIndex: number): void => {
    const items = [...indexes];
    items[levelIndex].imageIndex = imageIndex;
    setIndexes(items);
  };

  const handleChangeItem = (levelIndex: number, newItemIndex: number): void => {
    const items = [...indexes];
    items[levelIndex].itemIndex = newItemIndex;
    handleChangeCurrency(
      levelIndex,
      newItemIndex,
      0,
      items[levelIndex].currency
    );
    setIndexes(items);
  };

  useEffect(() => {
    if (allCollections) {
      handleShuffleCollectionLevels();
    }
  }, [allCollections]);

  useEffect(() => {
    if (!allCollections) {
      getAllAvailableCollections();
      handleOracles();
    }
  }, []);

  return {
    allCollectionsLoading,
    handleShuffleCollectionLevels,
    indexes,
    handleChangeCurrency,
    handleChangeImage,
    handleChangeItem,
  };
};

export default useLevelItems;
