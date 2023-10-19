import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setLevelArray } from "../../../../redux/reducers/levelArraySlice";
import { getAllCollections } from "../../../../graphql/subgraph/queries/getAllCollections";
import { setAvailableCollections } from "../../../../redux/reducers/availableCollectionsSlice";
import { Profile } from "../../../../graphql/generated";
import getProfile from "../../../../graphql/lens/queries/profile";
import { LevelInfo, PrintItem, PrintType } from "../types/launch.types";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";
import pickRandomItem from "../../../../lib/graph/helpers/pickRandomItem";
import cachedProfiles from "../../../../lib/graph/helpers/cachedProfiles";
import { DIGITALAX_PROFILE_ID_LENS } from "../../../../lib/constants";
import { setCachedProfiles } from "../../../../redux/reducers/cachedProfilesSlice";

const useLevelItems = () => {
  const dispatch = useDispatch();
  const allCollections = useSelector(
    (state: RootState) => state.app.availableCollectionsReducer.collections
  );
  const profiles = useSelector(
    (state: RootState) => state.app.cachedProfilesReducer.profiles
  );
  const [allCollectionsLoading, setAllCollectionsLoading] =
    useState<boolean>(false);
  const [priceIndex, setPriceIndex] = useState<number[][]>([]);

  const getAllAvailableCollections = async () => {
    setAllCollectionsLoading(true);
    try {
      const { data } = await getAllCollections();
      let profileCache: { [key: string]: Profile } = {};

      if (!profiles) {
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
    const usedItemIds: Set<string> = new Set();

    for (let level = 2; level <= 7; level++) {
      const levelObj: LevelInfo = { level, items: [] };
      switch (level) {
        case 2:
          levelObj.items.push(
            pickRandomItem(allCollections?.[PrintType.Sticker]!, usedItemIds)
          );
          break;
        case 3:
          levelObj.items.push(
            pickRandomItem(allCollections?.[PrintType.Poster]!, usedItemIds)
          );
          break;
        case 4:
          levelObj.items.push(
            pickRandomItem(allCollections?.[PrintType.Shirt]!, usedItemIds)
          );
          break;
        case 5:
          levelObj.items.push(
            pickRandomItem(allCollections?.[PrintType.Hoodie]!, usedItemIds)
          );
          break;
        case 6:
          levelObj.items.push(
            pickRandomItem(allCollections?.[PrintType.Sticker]!, usedItemIds),
            pickRandomItem(allCollections?.[PrintType.Poster]!, usedItemIds),
            pickRandomItem(allCollections?.[PrintType.Hoodie]!, usedItemIds),
            pickRandomItem(allCollections?.[PrintType.Shirt]!, usedItemIds)
          );
          break;
        case 7:
          levelObj.items.push(
            pickRandomItem(allCollections?.[PrintType.Sticker]!, usedItemIds),
            pickRandomItem(allCollections?.[PrintType.Sticker]!, usedItemIds),
            pickRandomItem(allCollections?.[PrintType.Poster]!, usedItemIds),
            pickRandomItem(allCollections?.[PrintType.Poster]!, usedItemIds),
            pickRandomItem(allCollections?.[PrintType.Shirt]!, usedItemIds),
            pickRandomItem(allCollections?.[PrintType.Shirt]!, usedItemIds),
            pickRandomItem(allCollections?.[PrintType.Hoodie]!, usedItemIds)
          );
          break;
      }
      levelArray?.push(levelObj);
    }

    dispatch(setLevelArray(levelArray));
  };

  useEffect(() => {
    if (allCollections) {
      handleShuffleCollectionLevels();
    }
  }, [allCollections]);

  useEffect(() => {
    if (!allCollections) {
      getAllAvailableCollections();
    }
  }, []);

  return {
    allCollectionsLoading,
    priceIndex,
    setPriceIndex,
    handleShuffleCollectionLevels,
  };
};

export default useLevelItems;
