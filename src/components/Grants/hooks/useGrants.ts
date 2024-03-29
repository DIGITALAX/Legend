import { useEffect, useState } from "react";
import { getAllGrants } from "../../../../graphql/subgraph/queries/getAllGrants";
import { OracleData, PrintItem } from "@/components/Launch/types/launch.types";
import { getOneCollection } from "../../../../graphql/subgraph/queries/getOneCollection";
import { Dispatch } from "redux";
import { setAllGrants } from "../../../../redux/reducers/allGrantsSlice";
import { Grant } from "../types/grant.types";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";
import getPublication from "../../../../graphql/lens/queries/publication";
import toHexWithLeadingZero from "../../../../lib/lens/helpers/toHexWithLeadingZero";
import { Profile } from "../../../../graphql/generated";
import getDefaultProfile from "../../../../graphql/lens/queries/defaultProfile";

const useGrants = (
  dispatch: Dispatch,
  allGrants: Grant[],
  collectionsCache: PrintItem[],
  lensConnected: Profile | undefined,
  oracleData: OracleData[]
) => {
  const [allGrantsLoading, setAllGrantsLoading] = useState<boolean>(false);
  const [showFundedHover, setShowFundedHover] = useState<boolean[]>([]);
  const [changeCurrency, setChangeCurrency] = useState<string[]>([]);
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
            granteeAddresses: string[];
            fundedAmount: {
              currency: string;
              funded: string;
            }[];
            milestones: {
              currencyGoal: {
                currency: string;
                amount: string;
              }[];
            }[];
          }) => {
            if (!item?.grantMetadata) {
              const data = await fetchIpfsJson(item?.uri);
              item = {
                ...item,
                grantMetadata: data,
              };
            }

            let totalFundedUSD: number = 0;
            if (item.fundedAmount?.length > 0) {
              item?.fundedAmount?.map((item) => {
                totalFundedUSD =
                  totalFundedUSD +
                  (Number(item.funded) *
                    Number(
                      oracleData.find((or) => or.currency == item.currency)
                        ?.rate
                    )) /
                    Number(
                      oracleData.find((or) => or.currency == item.currency)?.wei
                    );
              });
            }

            let totalGoalUSD: number = 0;

            item.milestones.map((mil) => {
              mil.currencyGoal.map((goal) => {
                totalGoalUSD =
                  totalGoalUSD +
                  (Number(goal.amount) *
                    Number(
                      oracleData.find((or) => or.currency == goal.currency)
                        ?.rate
                    )) /
                    Number(
                      oracleData.find((or) => or.currency == goal.currency)?.wei
                    );
              });
            });

            let granteePromises = await Promise.all(
              item?.granteeAddresses?.map(async (address) => {
                const grantee = await getDefaultProfile(
                  {
                    for: address,
                  },
                  lensConnected?.id
                );

                return grantee?.data?.defaultProfile;
              })
            );

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

                      if (!returnData?.collectionMetadata) {
                        returnData = {
                          ...returnData,
                          collectionMetadata: await fetchIpfsJson(
                            returnData?.uri!
                          ),
                        } as PrintItem;
                      }

                      returnData = {
                        ...returnData,
                        collectionMetadata: {
                          ...returnData?.collectionMetadata,
                          sizes: (
                            returnData?.collectionMetadata
                              ?.sizes as unknown as string
                          )?.split(","),
                          colors: (
                            returnData?.collectionMetadata
                              ?.colors as unknown as string
                          )?.split(","),
                        },
                      };
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
              totalFundedUSD: totalFundedUSD / 10 ** 18,
              totalGoalUSD: totalGoalUSD / 10 ** 18,
              grantees: granteePromises?.filter((item) => item !== undefined),
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

      setChangeCurrency(
        Array.from(
          { length: grants.length },
          (_, index: number) => grants?.[index]?.acceptedCurrencies?.[0]
        )
      );
      setShowFundedHover(Array.from({ length: grants.length }, () => false));

      dispatch(
        setAllGrants(
          grants?.sort(
            (a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)
          )
        )
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setAllGrantsLoading(false);
  };

  const handleFetchMoreGrants = async () => {
    if (!grantInfo.hasMore) return;
    try {
      const { data } = await getAllGrants(10, grantInfo.cursor);

      const grants = (await Promise.all(
        data?.grantCreateds?.map(
          async (item: {
            uri: string;
            grantMetadata: {};
            levelInfo: { collectionIds: string[]; amounts: string[] }[];
            profileId: string;
            pubId: string;
            granteeAddresses: string[];
            fundedAmount: {
              currency: string;
              funded: string;
            }[];
            milestones: {
              currencyGoal: {
                currency: string;
                amount: string;
              }[];
            }[];
          }) => {
            if (!item?.grantMetadata) {
              const data = await fetchIpfsJson(item?.uri);
              item = {
                ...item,
                grantMetadata: data,
              };
            }

            item = {
              ...item,
              grantMetadata: {
                ...item?.grantMetadata,
                milestones: (item?.grantMetadata as any)?.milestones?.map(
                  (item: string) => JSON.parse(item)
                ),
              },
            };

            let granteePromises = await Promise.all(
              item?.granteeAddresses?.map(async (address) => {
                const grantee = await getDefaultProfile(
                  {
                    for: address,
                  },
                  lensConnected?.id
                );

                return grantee?.data?.defaultProfile;
              })
            );

            const { data } = await getPublication(
              {
                forId: `${toHexWithLeadingZero(
                  Number(item?.profileId)
                )}-${toHexWithLeadingZero(Number(item?.pubId))}`,
              },
              lensConnected?.id
            );

            let totalFundedUSD: number = 0;
            if (item.fundedAmount?.length > 0) {
              item?.fundedAmount?.map((item) => {
                totalFundedUSD =
                  totalFundedUSD +
                  (Number(item.funded) *
                    Number(
                      oracleData.find((or) => or.currency == item.currency)
                        ?.rate
                    )) /
                    Number(
                      oracleData.find((or) => or.currency == item.currency)?.wei
                    );
              });
            }

            let totalGoalUSD: number = 0;

            item.milestones.map((mil) => {
              mil.currencyGoal.map((goal) => {
                totalGoalUSD =
                  totalGoalUSD +
                  (Number(goal.amount) *
                    Number(
                      oracleData.find((or) => or.currency == goal.currency)
                        ?.rate
                    )) /
                    Number(
                      oracleData.find((or) => or.currency == goal.currency)?.wei
                    );
              });
            });

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

                      if (!returnData?.collectionMetadata) {
                        returnData = {
                          ...returnData,
                          collectionMetadata: await fetchIpfsJson(
                            returnData?.uri!
                          ),
                        } as PrintItem;
                      }

                      returnData = {
                        ...returnData,
                        collectionMetadata: {
                          ...returnData?.collectionMetadata,
                          sizes: (
                            returnData?.collectionMetadata
                              ?.sizes as unknown as string
                          )?.split(","),
                          colors: (
                            returnData?.collectionMetadata
                              ?.colors as unknown as string
                          )?.split(","),
                        },
                      };
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
              grantees: granteePromises?.filter((item) => item !== undefined),
              publication: data?.publication,
              totalFundedUSD: totalFundedUSD / 10 ** 18,
              totalGoalUSD: totalGoalUSD / 10 ** 18,
            };
          }
        )
      )) as Grant[];

      if (grants?.length == 10) {
        setGrantInfo({
          hasMore: true,
          cursor: grantInfo.cursor + 10,
        });
      } else {
        setGrantInfo({
          hasMore: false,
          cursor: 0,
        });
      }

      setChangeCurrency([
        ...changeCurrency,
        ...Array.from(
          { length: grants.length },
          (_, index: number) => grants?.[index]?.acceptedCurrencies?.[0]
        ),
      ]);
      setShowFundedHover([
        ...showFundedHover,
        ...Array.from({ length: grants.length }, () => false),
      ]);

      dispatch(
        setAllGrants([
          ...allGrants,
          ...grants?.sort(
            (a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)
          ),
        ])
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (allGrants?.length < 1 && oracleData?.length > 0) {
      handleFetchGrants();
    }
  }, [allGrants?.length, oracleData?.length]);

  return {
    handleFetchMoreGrants,
    allGrantsLoading,
    grantInfo,
    changeCurrency,
    setChangeCurrency,
    showFundedHover,
    setShowFundedHover,
  };
};

export default useGrants;
