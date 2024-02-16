import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import { Grant } from "@/components/Grants/types/grant.types";
import getProfile from "../../../../graphql/lens/queries/profile";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";
import { OracleData } from "@/components/Launch/types/launch.types";
import getPublication from "../../../../graphql/lens/queries/publication";
import toHexWithLeadingZero from "../../../../lib/lens/helpers/toHexWithLeadingZero";
import getDefaultProfile from "../../../../graphql/lens/queries/defaultProfile";
import {
  getGrantsByProfile,
  getGrantsFunded,
} from "../../../../graphql/subgraph/queries/getAllGrants";

const useGrantee = (
  id: string,
  lensConnected: Profile | undefined,
  oracleData: OracleData[]
) => {
  const [showFundedHover, setShowFundedHover] = useState<boolean[]>([]);
  const [info, setInfo] = useState<{
    hasMore: boolean;
    cursorContributed: number;
    cursorCreated: number;
  }>({
    hasMore: true,
    cursorContributed: 0,
    cursorCreated: 0,
  });
  const [granteeLoading, setGranteeLoading] = useState<boolean>(false);
  const [grants, setGrants] = useState<(Grant & { type: string })[]>([]);
  const [grantee, setGrantee] = useState<Profile | undefined>();

  const getGrantProfile = async () => {
    setGranteeLoading(true);
    try {
      const { data } = await getProfile(
        {
          forHandle: "test/" + id,
        },
        lensConnected?.id
      );

      const createdData = await getGrantsByProfile(
        10,
        0,
        parseInt(data?.profile?.id, 16)
      );
      const contributedData = await getGrantsFunded(
        10,
        0,
        data?.profile?.ownedBy?.address
      );

      const contributed = (await Promise.all(
        contributedData?.data?.grantFundeds
          ?.map((item: { grant: Grant }) => item?.grant)
          ?.map(
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
                          ?.wei
                      )) /
                      Number(
                        oracleData.find((or) => or.currency == goal.currency)
                          ?.rate
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
                totalFundedUSD,
                totalGoalUSD,
                grantees: granteePromises?.filter((item) => item !== undefined),
                publication: data?.publication,
                type: "contributed",
              };
            }
          )
      )) as (Grant & { type: string })[];

      const created = (await Promise.all(
        createdData?.data?.grantCreateds?.map(
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
                      oracleData.find((or) => or.currency == goal.currency)?.wei
                    )) /
                    Number(
                      oracleData.find((or) => or.currency == goal.currency)
                        ?.rate
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
              totalFundedUSD,
              totalGoalUSD,
              grantees: granteePromises?.filter((item) => item !== undefined),
              publication: data?.publication,
              type: "created",
            };
          }
        )
      )) as (Grant & { type: string })[];

      setShowFundedHover(
        Array.from({ length: [...created, ...contributed].length }, () => false)
      );
      setGrants([...created, ...contributed]?.sort(() => Math.random() - 0.5));
      setGrantee(data?.profile as Profile);
      setInfo({
        hasMore:
          created?.length == 10 || contributed?.length == 10 ? true : false,
        cursorContributed: contributed?.length == 10 ? 10 : 0,
        cursorCreated: created?.length == 10 ? 10 : 0,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setGranteeLoading(false);
  };

  const handleMoreGrants = async () => {
    if (!info?.hasMore) return;
    try {
      let contributed: (Grant & { type: string })[] = [],
        created: (Grant & { type: string })[] = [];
      if (info?.cursorCreated !== 10) {
        const createdData = await getGrantsByProfile(
          10,
          info?.cursorCreated,
          parseInt(grantee?.id, 16)
        );

        created = (await Promise.all(
          createdData?.data?.grantCreateds?.map(
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
                          ?.wei
                      )) /
                      Number(
                        oracleData.find((or) => or.currency == goal.currency)
                          ?.rate
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
                totalFundedUSD,
                totalGoalUSD,
                grantees: granteePromises?.filter((item) => item !== undefined),
                publication: data?.publication,
                type: "created",
              };
            }
          )
        )) as (Grant & { type: string })[];
      }

      if (info?.cursorContributed !== 10) {
        const contributedData = await getGrantsFunded(
          10,
          info?.cursorContributed,
          grantee?.ownedBy?.address
        );

        contributed = (await Promise.all(
          contributedData?.data?.grantFundeds
            ?.map((item: { grant: Grant }) => item?.grant)
            ?.map(
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
                            ?.wei
                        )) /
                        Number(
                          oracleData.find((or) => or.currency == goal.currency)
                            ?.rate
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
                  totalFundedUSD,
                  totalGoalUSD,
                  grantees: granteePromises?.filter(
                    (item) => item !== undefined
                  ),
                  publication: data?.publication,
                  type: "contributed",
                };
              }
            )
        )) as (Grant & { type: string })[];
      }

      setShowFundedHover([
        ...showFundedHover,
        ...Array.from(
          { length: [...created, ...contributed].length },
          () => false
        ),
      ]);
      setGrants(
        [...grants, ...created, ...contributed]?.sort(() => Math.random() - 0.5)
      );
      setInfo({
        hasMore:
          created?.length == 10 || contributed?.length == 10 ? true : false,
        cursorContributed: contributed?.length == 10 ? 10 : 0,
        cursorCreated: created?.length == 10 ? 10 : 0,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (id && !grantee) {
      getGrantProfile;
    }
  }, [id]);

  return {
    granteeLoading,
    grantee,
    grants,
    showFundedHover,
    setShowFundedHover,
    info,
    handleMoreGrants,
    setGrants,
  };
};

export default useGrantee;
