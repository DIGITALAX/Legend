import { useEffect, useState } from "react";
import { getAllGrants } from "../../../../graphql/subgraph/queries/getAllGrants";
import { PrintItem } from "@/components/Launch/types/launch.types";
import { getOneCollection } from "../../../../graphql/subgraph/queries/getOneCollection";
import { Dispatch } from "redux";
import { setAllGrants } from "../../../../redux/reducers/allGrantsSlice";
import { Grant } from "../types/grant.types";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";
import getPublication from "../../../../graphql/lens/queries/publication";
import toHexWithLeadingZero from "../../../../lib/lens/helpers/toHexWithLeadingZero";
import { Profile } from "../../../../graphql/generated";

const useGrants = (
  dispatch: Dispatch,
  allGrants: Grant[],
  collectionsCache: PrintItem[],
  lensConnected: Profile | undefined
) => {
  const [allGrantsLoading, setAllGrantsLoading] = useState<boolean>(false);
  const [grantInfo, setGrantInfo] = useState<{
    hasMore: boolean;
    cursor: number;
  }>({ hasMore: true, cursor: 0 });

  const handleFetchGrants = async () => {
    setAllGrantsLoading(true);
    try {
      const { data } = await getAllGrants(10, 0);

      const grants = (await Promise.all(
        data?.grantCreateds?.map(
          async (item: {
            uri: string;
            grantMetadata: {};
            levelInfo: { collectionIds: string[]; amounts: string[] }[];
            profileId: string;
            pubId: string;
          }) => {
            if (!item?.grantMetadata) {
              const data = await fetchIpfsJson(item?.uri);
              item = {
                ...item,
                grantMetadata: data,
              };
            }

            const { data } = await getPublication(
              {
                forId: `${toHexWithLeadingZero(
                  Number(item?.profileId)
                )}-${toHexWithLeadingZero(Number(item?.pubId))}`,
              },
              lensConnected?.id
            );

            const levelInfo = await Promise.all(
              item?.levelInfo?.map(async (level) => {
                const collectionIds = await Promise.all(
                  level?.collectionIds?.map(async (coll) => {
                    let returnData = collectionsCache?.find(
                      (cache) => cache?.collectionId == coll
                    );
                    if (!returnData) {
                      const data = await getOneCollection(coll);
                      returnData = data?.data?.collectionCreateds?.[0];
                    }

                    return returnData;
                  })
                );

                return {
                  ...level,
                  collectionIds,
                  amounts: level?.amounts?.map((o) => Number(o)),
                };
              })
            );

            return {
              ...item,
              levelInfo,
              publication: data?.publication,
            };
          }
        )
      )) as Grant[];

      if (grants?.length == 10) {
        setGrantInfo({
          hasMore: true,
          cursor: 10,
        });
      } else {
        setGrantInfo({
          hasMore: false,
          cursor: 0,
        });
      }

      dispatch(setAllGrants(grants));
    } catch (err: any) {
      console.error(err.message);
    }
    setAllGrantsLoading(false);
  };

  const handleFetchMoreGrants = async () => {
    if (!grantInfo.hasMore) return;
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (allGrants?.length < 1) {
      handleFetchGrants();
    }
  }, [allGrants?.length]);

  return {
    handleFetchMoreGrants,
    allGrantsLoading,
    grantInfo,
  };
};

export default useGrants;
