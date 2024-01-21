import { useEffect, useState } from "react";
import {
  LimitType,
  Post,
  PublicationType,
} from "../../../../graphql/generated";
import getPublications from "../../../../graphql/lens/queries/publications";
import {
  PublishedGrantsState,
  setPublishedGrants,
} from "../../../../redux/reducers/publishedGrantsSlice";
import {
  InteractionsCountState,
  setInteractionsCount,
} from "../../../../redux/reducers/interactionsCountSlice";
import { getPubLevels } from "../../../../graphql/subgraph/queries/getPubLevels";
import { setAvailablePubLevels } from "../../../../redux/reducers/availablePubLevelsSlice";
import { LevelInfo, PrintItem } from "@/components/Launch/types/launch.types";
import { getOneCollection } from "../../../../graphql/subgraph/queries/getOneCollection";
import { Dispatch } from "redux";

const numberToWord: {
  [key: number]: string;
} = {
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
};

const useGrants = (
  dispatch: Dispatch,
  allPublications: PublishedGrantsState,
  interactionsCount: InteractionsCountState,
  pubLevels: {
    pubId: string;
    profileId: string;
    levelFive: string[];
    levelFour: string[];
    levelSeven: string[];
    levelSix: string[];
    levelThree: string[];
    levelTwo: string[];
  }[]
) => {
  const [collectChoice, setCollectChoice] = useState<
    {
      size: string;
      color: string;
    }[]
  >(Array.from({ length: 6 }, () => ({ size: "", color: "" })));
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

  const handleFetchGrants = async () => {
    try {
      const data = await getPublications({
        limit: LimitType.Ten,
        where: {
          publicationTypes: [PublicationType.Post],
          metadata: {
            // mainContentFocus: [PublicationMetadataMainFocusType.Image],
            // tags: {
            //   all: ["legend", "legendgrant"],
            // },
            publishedOn: ["legend"],
          },
        },
      });

      const arr: Post[] = [...(data?.data?.publications.items || [])] as Post[];
      let sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      const apparelItems = await handleApparelMatch(sortedArr);

      dispatch(
        setPublishedGrants({
          actionItems: sortedArr,
          actionApparel: apparelItems,
          actionCursor: data?.data?.publications.pageInfo.next,
        })
      );
      dispatch(
        setInteractionsCount({
          actionLikes: sortedArr.map((obj) => obj.stats.reactions),
          actionMirrors: sortedArr.map((obj) => obj.stats.mirrors),
          actionQuotes: sortedArr.map((obj) => obj.stats.quotes),
          actionCollects: sortedArr.map((obj) => obj.stats.countOpenActions),
          actionComments: sortedArr.map((obj) => obj.stats.comments),
          actionHasLiked: sortedArr.map((obj) => obj.operations.hasReacted),
          actionHasMirrored: sortedArr.map((obj) => obj.operations.hasMirrored),
          actionHasCollected: sortedArr.map((obj) => obj.operations.hasActed),
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleFetchMoreGrants = async () => {
    try {
      if (!allPublications.cursor) return;
      const data = await getPublications({
        cursor: allPublications.cursor,
        limit: LimitType.Ten,
        where: {
          publicationTypes: [PublicationType.Post],
          metadata: {
            // mainContentFocus: [PublicationMetadataMainFocusType.Image],
            tags: {
              all: ["legend", "legendgrant"],
            },
            publishedOn: ["legend"],
          },
        },
      });

      const arr: Post[] = [...(data?.data?.publications.items || [])] as Post[];
      let sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      const apparelItems = await handleApparelMatch(sortedArr);

      dispatch(
        setPublishedGrants({
          actionItems: [...allPublications.items, ...sortedArr],
          actionApparel: apparelItems,
          actionCursor: data?.data?.publications.pageInfo.next,
        })
      );
      dispatch(
        setInteractionsCount({
          actionLikes: [
            ...interactionsCount.likes,
            ...sortedArr.map((obj) => obj.stats.reactions),
          ],

          actionMirrors: [
            ...interactionsCount.mirrors,
            ...sortedArr.map((obj) => obj.stats.mirrors),
          ],
          actionQuotes: [
            ...interactionsCount.quotes,
            ...sortedArr.map((obj) => obj.stats.quotes),
          ],
          actionCollects: [
            ...interactionsCount.collects,
            ...sortedArr.map((obj) => obj.stats.countOpenActions),
          ],
          actionComments: [
            ...interactionsCount.comments,
            ...sortedArr.map((obj) => obj.stats.comments),
          ],
          actionHasLiked: [
            ...interactionsCount.hasLiked,
            ...sortedArr.map((obj) => obj.operations.hasReacted),
          ],
          actionHasMirrored: [
            ...interactionsCount.hasMirrored,
            ...sortedArr.map((obj) => obj.operations.hasMirrored),
          ],
          actionHasCollected: [
            ...interactionsCount.hasCollected,
            ...sortedArr.map((obj) => obj.operations.hasActed),
          ],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleApparelMatch = async (
    sortedArr: Post[]
  ): Promise<LevelInfo[][] | undefined> => {
    try {
      let apparelItems: LevelInfo[][] = [];

      const apparelPromises = sortedArr.map(async (post: Post) => {
        let levelInfoArray: LevelInfo[] = [];
        const matchingPubLevel = pubLevels.find(
          (pubLevel) =>
            Number(pubLevel.pubId) === parseInt(post.id.split("-")[1], 16)
        );

        if (matchingPubLevel) {
          for (let level = 2; level <= 7; level++) {
            const levelKey =
              `level${numberToWord[level]}` as keyof typeof matchingPubLevel;
            const collectionIds: string[] = matchingPubLevel[
              levelKey
            ] as string[];

            const itemPromises: Promise<PrintItem>[] = collectionIds?.map(
              async (collectionId) => {
                const { data } = await getOneCollection(collectionId);
                return data?.collectionCreateds?.[0];
              }
            );

            const items: PrintItem[] = await Promise.all(itemPromises);
            levelInfoArray.push({
              level,
              items,
            });
          }
          apparelItems.push(levelInfoArray);
        }
      });
      await Promise.all(apparelPromises);

      // return ;
      return apparelItems;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleFetchApparelLevels = async () => {
    try {
      const { data } = await getPubLevels();
      dispatch(setAvailablePubLevels(data?.levelsAddeds));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (pubLevels.length > 0) {
      handleFetchGrants();
    }
  }, [pubLevels.length]);

  useEffect(() => {
    if (pubLevels.length < 1) {
      handleFetchApparelLevels();
    }
  }, []);

  return {
    collectChoice,
    setCollectChoice,
    handleFetchMoreGrants,
  };
};

export default useGrants;
