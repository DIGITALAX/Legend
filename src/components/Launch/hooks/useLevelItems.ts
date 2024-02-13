import { useEffect, useState } from "react";
import { setLevelArray } from "../../../../redux/reducers/levelArraySlice";
import { getAllCollections } from "../../../../graphql/subgraph/queries/getAllCollections";
import { setAvailableCollections } from "../../../../redux/reducers/availableCollectionsSlice";
import {
  Details,
  LevelInfo,
  PostInformation,
  PrintItem,
  PrintType,
} from "../types/launch.types";
import pickRandomItem from "../../../../lib/graph/helpers/pickRandomItem";
import { Dispatch } from "redux";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";
import { ACCEPTED_TOKENS_MUMBAI } from "../../../../lib/constants";
import { Grant } from "@/components/Grants/types/grant.types";
import { NextRouter } from "next/router";

const useLevelItems = (
  dispatch: Dispatch,
  postInformation?: PostInformation,
  allCollections?:
    | {
        [key: string]: PrintItem[];
      }
    | undefined,
  allGrants?: Grant[],
  router?: NextRouter
) => {
  const [allCollectionsLoading, setAllCollectionsLoading] =
    useState<boolean>(false);
  const [details, setDetails] = useState<Details[][]>([]);

  const getAllAvailableCollections = async () => {
    setAllCollectionsLoading(true);
    try {
      const { data } = await getAllCollections();

      const filteredCollections = data?.collectionCreateds?.filter(
        (item: { acceptedTokens: string[] }) =>
          postInformation?.currencies.filter((curr) =>
            item.acceptedTokens.includes(curr)
          )
      );

      const categorizedCollections: { [key: string]: PrintItem[] } = {
        [PrintType.Sticker]: [],
        [PrintType.Poster]: [],
        [PrintType.Shirt]: [],
        [PrintType.Hoodie]: [],
      };

      await Promise.all(
        filteredCollections?.map(async (item: PrintItem) => {
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

    setDetails([
      Array.from({ length: 7 }, (_, index: number) => ({
        currency: ACCEPTED_TOKENS_MUMBAI[2][2],
        sizeIndex: Array.from(
          { length: levelArray[index]?.collectionIds?.length },
          () => 0
        ),
        colorIndex: Array.from(
          { length: levelArray[index]?.collectionIds?.length },
          () => 0
        ),
        imageIndex: Array.from(
          { length: levelArray[index]?.collectionIds?.length },
          () => 0
        ),
        collectionIndex: 0,
      })),
    ]);

    dispatch(setLevelArray(levelArray));
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

  useEffect(() => {
    if (router?.asPath == "/" && allGrants && allGrants?.length > 0) {
      setDetails(
        Array.from({ length: allGrants.length }, (_, index: number) =>
          Array.from({ length: 7 }, (_, indexTwo: number) => ({
            currency: ACCEPTED_TOKENS_MUMBAI[2][2],
            sizeIndex: Array.from(
              {
                length:
                  allGrants[index].levelInfo[indexTwo]?.collectionIds?.length,
              },
              () => 0
            ),
            colorIndex: Array.from(
              {
                length:
                  allGrants[index].levelInfo[indexTwo]?.collectionIds?.length,
              },
              () => 0
            ),
            imageIndex: Array.from(
              {
                length:
                  allGrants[index].levelInfo[indexTwo]?.collectionIds?.length,
              },
              () => 0
            ),
            collectionIndex: 0,
          }))
        )
      );
    }
  }, [allGrants?.length, router]);

  return {
    allCollectionsLoading,
    handleShuffleCollectionLevels,
    details,
    setDetails,
  };
};

export default useLevelItems;
