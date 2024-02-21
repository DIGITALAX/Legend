import { useEffect, useRef, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import { Grant } from "@/components/Grants/types/grant.types";
import {
  OracleData,
  PrintItem,
  PrintType,
} from "@/components/Launch/types/launch.types";
import {
  getAllGrants,
  getGrantsWhere,
} from "../../../../graphql/subgraph/queries/getAllGrants";
import getDefaultProfile from "../../../../graphql/lens/queries/defaultProfile";
import getPublication from "../../../../graphql/lens/queries/publication";
import toHexWithLeadingZero from "../../../../lib/lens/helpers/toHexWithLeadingZero";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";
import { printStringToNumber } from "../../../../lib/constants";
import { isEmpty } from "lodash";

const useWeb3 = (
  lensConnected: Profile | undefined,
  oracleData: OracleData[]
) => {
  const inputElement = useRef<HTMLInputElement | null>(null);
  const [showFundedHover, setShowFundedHover] = useState<boolean[]>([]);
  const [info, setInfo] = useState<{ hasMore: boolean; cursor: number }>({
    hasMore: true,
    cursor: 0,
  });
  const [_, setCaretCoord] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [profilesOpen, setProfilesOpen] = useState<boolean[]>([false]);
  const [grantsLoading, setGrantsLoading] = useState<boolean>(false);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [searchFilters, setSearchFilters] = useState<{
    printType: string[];
    timestamp: string;
    grant: string;
    designer: string;
    designerAddress: string;
  }>({
    printType: [],
    timestamp: "latest",
    grant: "",
    designer: "@",
    designerAddress: "",
  });

  const handleGrants = async () => {
    setGrantsLoading(true);
    try {
      const { data } = await getAllGrants(20, 0);

      const awaited = (await Promise.all(
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

            return {
              ...item,
              totalFundedUSD: totalFundedUSD / 10 ** 18,
              totalGoalUSD: totalGoalUSD / 10 ** 18,
              grantees: granteePromises?.filter((item) => item !== undefined),
              publication: data?.publication,
            };
          }
        )
      )) as Grant[];

      if (awaited?.length == 20) {
        setInfo({
          hasMore: true,
          cursor: 20,
        });
      } else {
        setInfo({
          hasMore: false,
          cursor: 0,
        });
      }
      setGrants(awaited);
      setShowFundedHover(Array.from({ length: awaited?.length }, () => false));
    } catch (err: any) {
      console.error(err.message);
    }
    setGrantsLoading(false);
  };

  const handleGrantsFilter = async () => {
    setGrantsLoading(true);
    try {
      let grantsWhere = {};

      if (
        searchFilters?.designer?.trim() !== "" &&
        searchFilters?.designer?.trim() !== "@"
      ) {
        grantsWhere = {
          and: [{ owner: searchFilters?.designerAddress }],
        };
      }

      if (searchFilters?.grant?.trim() !== "") {
        grantsWhere = {
          and: [
            ...(grantsWhere as any)?.and,
            { grantMetadata_: { title_contains_nocase: searchFilters?.grant } },
          ],
        };
      }

      if (searchFilters?.printType?.length > 0) {
        const prints = searchFilters?.printType?.map((name) => ({
          [name]: true,
        }));

        if (prints?.length > 1) {
          grantsWhere = {
            and: [...(grantsWhere as any)?.and, { ...prints }],
          };
        } else {
          grantsWhere = {
            and: [...(grantsWhere as any)?.and, { or: [...prints] }],
          };
        }
      }

      let grantsAwaited: Grant[] = [];

      if (!isEmpty(Object.values(grantsWhere))) {
        const { data } = await getGrantsWhere(20, 0, grantsWhere);

        grantsAwaited = (await Promise.all(
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
                        oracleData.find((or) => or.currency == item.currency)
                          ?.wei
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
                        oracleData.find((or) => or.currency == goal.currency)
                          ?.wei
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

              return {
                ...item,
                totalFundedUSD: totalFundedUSD / 10 ** 18,
                totalGoalUSD: totalGoalUSD / 10 ** 18,
                grantees: granteePromises?.filter((item) => item !== undefined),
                publication: data?.publication,
              };
            }
          )
        )) as Grant[];
      }

      setGrants([...grants, ...grantsAwaited]);
      setInfo({
        hasMore: grantsAwaited?.length > 20 ? true : false,
        cursor: grantsAwaited?.length > 20 ? 20 : 0,
      });
      setShowFundedHover(
        Array.from({ length: grantsAwaited?.length }, () => false)
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setGrantsLoading(false);
  };

  const handleMoreFilteredGrants = async () => {
    if (!info.hasMore) return;
    try {
      let grantsWhere = {};

      if (
        searchFilters?.designer?.trim() !== "" &&
        searchFilters?.designer?.trim() !== "@"
      ) {
        grantsWhere = {
          and: [{ owner: searchFilters?.designerAddress }],
        };
      }

      if (searchFilters?.grant?.trim() !== "") {
        grantsWhere = {
          and: [
            ...(grantsWhere as any)?.and,
            { grantMetadata_: { title_contains_nocase: searchFilters?.grant } },
          ],
        };
      }

      if (searchFilters?.printType?.length > 0) {
        const prints = searchFilters?.printType?.map((name) => ({
          [name]: true,
        }));

        if (prints?.length > 1) {
          grantsWhere = {
            and: [...(grantsWhere as any)?.and, { ...prints }],
          };
        } else {
          grantsWhere = {
            and: [...(grantsWhere as any)?.and, { or: [...prints] }],
          };
        }
      }

      let grantsAwaited: Grant[] = [];

      if (!isEmpty(Object.values(grantsWhere))) {
        const { data } = await getGrantsWhere(20, info?.cursor, grantsWhere);

        grantsAwaited = (await Promise.all(
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
                        oracleData.find((or) => or.currency == item.currency)
                          ?.wei
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
                        oracleData.find((or) => or.currency == goal.currency)
                          ?.wei
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

              return {
                ...item,
                totalFundedUSD: totalFundedUSD / 10 ** 18,
                totalGoalUSD: totalGoalUSD / 10 ** 18,
                grantees: granteePromises?.filter((item) => item !== undefined),
                publication: data?.publication,
              };
            }
          )
        )) as Grant[];
      }

      setGrants([...grants, ...grantsAwaited]);
      setInfo({
        hasMore: grantsAwaited?.length > 20 ? true : false,
        cursor: grantsAwaited?.length > 20 ? info?.cursor + 20 : 0,
      });

      setShowFundedHover([
        ...showFundedHover,
        ...Array.from({ length: grantsAwaited?.length }, () => false),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
  };
  const handleMoreGrants = async () => {
    if (!info.hasMore) return;
    try {
      const { data } = await getAllGrants(20, info?.cursor);

      const awaited = (await Promise.all(
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

            return {
              ...item,
              totalFundedUSD: totalFundedUSD / 10 ** 18,
              totalGoalUSD: totalGoalUSD / 10 ** 18,
              grantees: granteePromises?.filter((item) => item !== undefined),
              publication: data?.publication,
            };
          }
        )
      )) as Grant[];

      if (awaited?.length == 20) {
        setInfo({
          hasMore: true,
          cursor: info?.cursor + 20,
        });
      } else {
        setInfo({
          hasMore: false,
          cursor: 0,
        });
      }
      setGrants([...grants, ...awaited]);
      setShowFundedHover([
        ...showFundedHover,
        ...Array.from({ length: awaited?.length }, () => false),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (grants?.length < 1 && oracleData?.length > 0) {
      handleGrants();
    }
  }, [oracleData]);

  useEffect(() => {
    if (grants?.length > 0) {
      handleGrantsFilter();
    }
  }, [
    searchFilters?.designer,
    searchFilters?.grant,
    searchFilters?.printType?.length,
  ]);

  return {
    mentionProfiles,
    setMentionProfiles,
    profilesOpen,
    setProfilesOpen,
    grantsLoading,
    info,
    inputElement,
    setCaretCoord,
    searchFilters,
    setSearchFilters,
    handleMoreFilteredGrants,
    handleMoreGrants,
    grants,
    setGrants,
    setShowFundedHover,
    showFundedHover,
  };
};

export default useWeb3;
