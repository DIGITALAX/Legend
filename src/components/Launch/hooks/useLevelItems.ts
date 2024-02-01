import { useEffect, useState } from "react";
import { setLevelArray } from "../../../../redux/reducers/levelArraySlice";
import { getAllCollections } from "../../../../graphql/subgraph/queries/getAllCollections";
import { setAvailableCollections } from "../../../../redux/reducers/availableCollectionsSlice";
import {
  LevelInfo,
  OracleData,
  PrintItem,
  PrintType,
} from "../types/launch.types";
import pickRandomItem from "../../../../lib/graph/helpers/pickRandomItem";
import { ACCEPTED_TOKENS_MUMBAI } from "../../../../lib/constants";
import { Dispatch } from "redux";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";

const useLevelItems = (
  dispatch: Dispatch,
  oracleData: OracleData[],
  allCollections?:
    | {
        [key: string]: PrintItem[];
      }
    | undefined
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

      const categorizedCollections: { [key: string]: PrintItem[] } = {
        [PrintType.Sticker]: [],
        [PrintType.Poster]: [],
        [PrintType.Shirt]: [],
        [PrintType.Hoodie]: [],
      };

      await Promise.all(
        data?.collectionCreateds?.map(async (item: PrintItem) => {
          const fulfillerBase = Number(item?.fulfillerBase || 0) / 10 ** 18;
          const fulfillerPercent = Number(item?.fulfillerPercent || 0) / 10000;

          const designerPercent = Number(item?.designerPercent || 0) / 10000;

          if (!item?.collectionMetadata) {
            item = {
              ...item,
              collectionMetadata: await fetchIpfsJson(item?.uri),
            };
          }

          categorizedCollections[item?.printType].push({
            ...item,
            designerPercent,
            fulfillerBase,
            fulfillerPercent,
            collectionMetadata: {
              ...item?.collectionMetadata,
              sizes: (
                item?.collectionMetadata?.sizes as unknown as string
              )?.split(","),
              colors: (
                item?.collectionMetadata?.colors as unknown as string
              )?.split(","),
            },
          } as PrintItem);
        })
      );

      dispatch(setAvailableCollections(categorizedCollections));
    } catch (err: any) {
      console.error(err.message);
    }
    setAllCollectionsLoading(false);
  };

  const handleShuffleCollectionLevels = () => {
    const levelArray: LevelInfo[] = [];

    for (let level = 2; level <= 7; level++) {
      const levelObj: LevelInfo = { level, collectionIds: [], amounts: [] };
      switch (level) {
        case 2:
          levelObj.collectionIds.push(
            pickRandomItem(allCollections?.[PrintType.Sticker]!)
          );
          break;
        case 3:
          levelObj.collectionIds.push(
            pickRandomItem(allCollections?.[PrintType.Poster]!)
          );
          break;
        case 4:
          levelObj.collectionIds.push(
            pickRandomItem(allCollections?.[PrintType.Shirt]!)
          );
          break;
        case 5:
          levelObj.collectionIds.push(
            pickRandomItem(allCollections?.[PrintType.Hoodie]!)
          );
          break;
        case 6:
          levelObj.collectionIds.push(
            pickRandomItem(allCollections?.[PrintType.Sticker]!),
            pickRandomItem(allCollections?.[PrintType.Poster]!),
            pickRandomItem(allCollections?.[PrintType.Hoodie]!),
            pickRandomItem(allCollections?.[PrintType.Shirt]!)
          );
          break;
        case 7:
          levelObj.collectionIds.push(
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
            : levelArray[index - 1]?.collectionIds?.map((item) =>
                Number(item?.prices[0])
              ),
        itemIndex: 0,
      }))
    );

    dispatch(setLevelArray(levelArray));
  };

  const handleChangeCurrency = (
    levelIndex: number,
    priceIndex: number,
    checkoutCurrency: string,
    checkoutPrice: number
  ): void => {
    const items = [...indexes];
    items[levelIndex].currency = checkoutCurrency;
    items[levelIndex].priceIndex = priceIndex;
    if (levelIndex != 0) {
      items[levelIndex].price[priceIndex] = checkoutPrice;
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
      0,
      items[levelIndex].currency,
      items[levelIndex].price?.[0]
    );
    setIndexes(items);
  };

  useEffect(() => {
    if (allCollections) {
      handleShuffleCollectionLevels();
    }
  }, [allCollections]);

  useEffect(() => {
    if (!allCollections || Object.keys(allCollections)?.length < 1) {
      getAllAvailableCollections();
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
