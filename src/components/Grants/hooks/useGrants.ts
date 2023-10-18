import { useEffect, useState } from "react";

import {
  LimitType,
  Post,
  PublicationMetadataMainFocusType,
  PublicationType,
  PublicationsOrderByType,
} from "../../../../graphql/generated";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import getPublications from "../../../../graphql/queries/publications";
import { setPublishedGrants } from "../../../../redux/reducers/publishedGrantsSlice";
import { setInteractionsCount } from "../../../../redux/reducers/interactionsCountSlice";

const useGrants = () => {
  const dispatch = useDispatch();
  const [imageIndex, setImageIndex] = useState<number[]>([0]);
  const [collectChoice, setCollectChoice] = useState<
    {
      size: string;
      color: string;
    }[]
  >(Array.from({ length: 7 }, () => ({ size: "", color: "" })));
  const allPublications = useSelector(
    (state: RootState) => state.app.publishedGrantsReducer
  );
  const interactionsCount = useSelector(
    (state: RootState) => state.app.interactionsCountReducer
  );

  const handleFetchGrants = async () => {
    try {
      const data = await getPublications({
        limit: LimitType.Fifty,
        orderBy: PublicationsOrderByType.Latest,
        where: {
          publicationTypes: [PublicationType.Post],
          metadata: {
            mainContentFocus: [PublicationMetadataMainFocusType.Image],
            tags: {
              all: ["legend", "legendgrant"],
            },
          },
        },
      });

      const arr: Post[] = [...(data?.data?.publications.items || [])] as Post[];
      let sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      const apparelItems = await handleFetchApparelLevels();
      const umaItems = await handleFetchUMA();

      dispatch(
        setPublishedGrants({
          actionItems: sortedArr,
          actionUmaInfo: umaItems,
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
        limit: LimitType.Fifty,
        orderBy: PublicationsOrderByType.Latest,
        where: {
          publicationTypes: [PublicationType.Post],
          metadata: {
            mainContentFocus: [PublicationMetadataMainFocusType.Image],
            tags: {
              all: ["legend", "legendgrant"],
            },
          },
        },
      });

      const arr: Post[] = [...(data?.data?.publications.items || [])] as Post[];
      let sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      const apparelItems = await handleFetchMoreApparelLevels();
      const umaItems = await handleFetchMoreUMA();

      dispatch(
        setPublishedGrants({
          actionItems: [...allPublications.items, ...sortedArr],
          actionUmaInfo: umaItems,
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

  const handleFetchApparelLevels = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleFetchMoreApparelLevels = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleFetchUMA = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleFetchMoreUMA = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    handleFetchGrants();
  }, []);

  return {
    imageIndex,
    setImageIndex,
    collectChoice,
    setCollectChoice,
    handleFetchMoreGrants,
  };
};

export default useGrants;
