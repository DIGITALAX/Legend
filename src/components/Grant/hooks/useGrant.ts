import { Grant } from "@/components/Grants/types/grant.types";
import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import { OracleData, PrintItem } from "@/components/Launch/types/launch.types";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";
import { getOneCollection } from "../../../../graphql/subgraph/queries/getOneCollection";
import getPublication from "../../../../graphql/lens/queries/publication";
import toHexWithLeadingZero from "../../../../lib/lens/helpers/toHexWithLeadingZero";
import getDefaultProfile from "../../../../graphql/lens/queries/defaultProfile";
import { getGrant } from "../../../../graphql/subgraph/queries/getAllGrants";

const useGrant = (
  id: string,
  lensConnected: Profile | undefined,
  collectionsCache: PrintItem[],
  oracleData: OracleData[]
) => {
  const [grant, setGrant] = useState<Grant>();
  const [changeCurrency, setChangeCurrency] = useState<string[]>([]);
  const [grantLoading, setGrantLoading] = useState<boolean>(false);
  const [showFundedHover, setShowFundedHover] = useState<boolean>(false);

  const handleGrant = async () => {
    setGrantLoading(true);
    try {
      const data = await getGrant(
        parseInt(id?.split("-")?.[1], 16),
        parseInt(id?.split("-")?.[0], 16)
      );

      const grants = (await Promise.all(
        data?.data?.grantCreateds?.map(
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
            funders: {
              address: string;
              usdAmount: string;
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

            const funders = await Promise.all(
              item?.funders?.map(async (funder) => {
                const data = await getDefaultProfile(
                  {
                    for: funder?.address,
                  },
                  lensConnected?.id
                );

                return {
                  ...funder,
                  profile: data?.data?.defaultProfile,
                };
              })
            );

            let totalFundedUSD: number = 0;
            if (item.fundedAmount?.length > 0) {
              item?.fundedAmount?.map((item) => {
                totalFundedUSD =
                  totalFundedUSD +
                  ((Number(item.funded) / 10 ** 18) *
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
                  ((Number(goal.amount) / 10 ** 18) *
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
              totalFundedUSD,
              totalGoalUSD,
              grantees: granteePromises?.filter((item) => item !== undefined),
              publication: data?.publication,
              funders,
            };
          }
        )
      )) as Grant[];
      setChangeCurrency([grants?.[0]?.acceptedCurrencies?.[0]]);
      setGrant(grants[0]);
    } catch (err: any) {
      console.error(err.message);
    }
    setGrantLoading(false);
  };

  useEffect(() => {
    if (id) {
      handleGrant();
    }
  }, [id, lensConnected?.id]);

  return {
    grant,
    grantLoading,
    setGrant,
    showFundedHover,
    setShowFundedHover,
    changeCurrency,
    setChangeCurrency,
  };
};

export default useGrant;
