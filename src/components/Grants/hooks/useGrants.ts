import { useEffect, useState } from "react";
import {
  LimitType,
  Post,
  Profile,
  PublicationMetadataMainFocusType,
  PublicationType,
  PublicationsOrderByType,
} from "../../../../graphql/generated";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import getPublications from "../../../../graphql/lens/queries/publications";
import { setPublishedGrants } from "../../../../redux/reducers/publishedGrantsSlice";
import { setInteractionsCount } from "../../../../redux/reducers/interactionsCountSlice";
import { getPubLevels } from "../../../../graphql/subgraph/queries/getPubLevels";
import { setAvailablePubLevels } from "../../../../redux/reducers/availablePubLevelsSlice";
import { LevelInfo, PrintItem } from "@/components/Launch/types/launch.types";
import { getOneCollection } from "../../../../graphql/subgraph/queries/getOneCollection";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";
import { DIGITALAX_PROFILE_ID_LENS } from "../../../../lib/constants";
import getProfile from "../../../../graphql/lens/queries/profile";
import cachedProfiles from "../../../../lib/graph/helpers/cachedProfiles";
import { setCachedProfiles } from "../../../../redux/reducers/cachedProfilesSlice";

const useGrants = () => {
  const dispatch = useDispatch();
  const allPublications = useSelector(
    (state: RootState) => state.app.publishedGrantsReducer
  );
  const profiles = useSelector(
    (state: RootState) => state.app.cachedProfilesReducer.profiles
  );
  const interactionsCount = useSelector(
    (state: RootState) => state.app.interactionsCountReducer
  );
  const pubLevels = useSelector(
    (state: RootState) => state.app.availablePubLevelsReducer.levels
  );

  const [imageIndex, setImageIndex] = useState<number[]>([0]);
  const [collectChoice, setCollectChoice] = useState<
    {
      size: string;
      color: string;
    }[]
  >(Array.from({ length: 6 }, () => ({ size: "", color: "" })));

  const handleFetchGrants = async () => {
    try {
      const data = await getPublications({
        limit: LimitType.Ten,
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
  ): Promise<LevelInfo[][][] | undefined> => {
    try {
      let apparelItems: LevelInfo[][] = [];

      let profileCache: { [key: string]: Profile } = {};

      if (!profiles) {
        profileCache = (await cachedProfiles()) as { [key: string]: Profile };
      } else {
        profileCache = profiles;
      }

      const apparelPromises = sortedArr.map(async (post: Post) => {
        let levelInfoArray: LevelInfo[] = [];
        const matchingPubLevel = pubLevels.find(
          (pubLevel) => pubLevel.pubId === post.id
        );

        if (matchingPubLevel) {
          for (let level = 2; level <= 7; level++) {
            const levelKey = `level${level}` as keyof typeof matchingPubLevel;
            const collectionIds: string[] = matchingPubLevel[
              levelKey
            ] as string[];

            const itemPromises: Promise<PrintItem>[] = collectionIds.map(
              async (collectionId) => {
                const { data } = await getOneCollection(collectionId);
                const obj = data?.collectionCreateds?.[0];

                const uri: {
                  images: string[];
                  description: string;
                  title: string;
                  profileId: string;
                  tags: string[];
                  prompt: string;
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

                return {
                  ...obj,
                  uri: {
                    ...uri,
                    profile,
                  },
                };
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

        return apparelItems;
      });

      dispatch(setCachedProfiles(profileCache));

      return await Promise.all(apparelPromises);
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
    imageIndex,
    setImageIndex,
    collectChoice,
    setCollectChoice,
    handleFetchMoreGrants,
  };
};

export default useGrants;
