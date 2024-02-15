import { PrintItem } from "@/components/Launch/types/launch.types";
import { useEffect, useRef, useState } from "react";
import {
  getCollections,
  getCollectionsFilter,
} from "../../../../graphql/subgraph/queries/getAllCollections";
import getPublication from "../../../../graphql/lens/queries/publication";
import toHexWithLeadingZero from "../../../../lib/lens/helpers/toHexWithLeadingZero";
import { Profile } from "../../../../graphql/generated";
import {
  getGrantsByCollectionId,
  getGrantsByCollectionIdFilter,
} from "../../../../graphql/subgraph/queries/getAllGrants";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";
import {
  numberToPrintType,
  printStringToNumber,
  printTypeToString,
} from "../../../../lib/constants";
import { isEmpty } from "lodash";
import { getOneCollection } from "../../../../graphql/subgraph/queries/getOneCollection";

const useStore = (lensConnected: Profile | undefined) => {
  const [_, setCaretCoord] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [profilesOpen, setProfilesOpen] = useState<boolean[]>([false]);

  const inputElement = useRef<HTMLInputElement | null>(null);
  const [info, setInfo] = useState<{ hasMore: boolean; cursor: number }>({
    hasMore: false,
    cursor: 0,
  });
  const [collectionsLoading, setCollectionsLoading] = useState<boolean>(false);
  const [collections, setCollections] = useState<PrintItem[]>([]);
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

  const handleCollectionsFilter = async () => {
    setCollectionsLoading(true);
    try {
      let collectionWhere = {
        and: [{ origin: 0 }],
      };
      let grantWhere = {};
      if (searchFilters?.printType?.length > 0) {
        const prints = searchFilters?.printType?.map((s) => ({
          printType: Number(
            printStringToNumber[s?.slice(0, 1).toUpperCase() + s?.slice(1)]
          ),
        }));

        if (searchFilters?.printType?.length > 1) {
          collectionWhere = {
            and: [
              ...(collectionWhere as any).and,
              {
                or: [...prints],
              },
            ],
          };
        } else {
          collectionWhere = {
            and: [...(collectionWhere as any).and, ...prints],
          };
        }
      }

      if (
        searchFilters?.designer?.trim() !== "" &&
        searchFilters?.designer?.trim() !== "@"
      ) {
        collectionWhere = {
          and: [
            ...(collectionWhere as any).and,
            { owner: searchFilters?.designerAddress },
          ],
        };
      }

      if (searchFilters?.grant?.trim() !== "") {
        grantWhere = {
          and: [
            ...(grantWhere as any).and,
            { grantMetadata_: { title_contains_nocase: searchFilters?.grant } },
          ],
        };
      }

      console.log({ grantWhere, collectionWhere });

      let collectedAwaited: PrintItem[] = [];
      let grantAwaited: PrintItem[] = [];

      if (collectionWhere?.and?.filter((item) => !item.origin)?.length > 0) {
        const data = await getCollectionsFilter(20, 0, collectionWhere);
        console.log({ data });

        collectedAwaited = await Promise.all(
          data?.collectionCreateds?.map(
            async (item: {
              pubId: string;
              profileId: string;
              collectionId: string;
              printType: string;
            }) => {
              const publication = await getPublication(
                {
                  forId: `${toHexWithLeadingZero(
                    Number(item.profileId)
                  )}-${toHexWithLeadingZero(Number(item.pubId))}`,
                },
                lensConnected?.id
              );
              const { data } = await getGrantsByCollectionId(
                Number(item?.collectionId)
              );

              const grants = await Promise.all(
                data?.collectionGrantIds?.[0]?.grants?.map(
                  async (item: { grantMetadata: {}; uri: string }) => {
                    if (!item?.grantMetadata) {
                      const data = await fetchIpfsJson(item?.uri);
                      item = {
                        ...item,
                        grantMetadata: data,
                      };
                    }

                    return item;
                  }
                )
              );
              return {
                ...item,
                publication: publication?.data?.publication,
                printType:
                  printTypeToString[numberToPrintType[Number(item?.printType)]],
                grants,
              };
            }
          )
        );
      }

      if (!isEmpty(Object.values(grantWhere))) {
        const { data } = await getGrantsByCollectionIdFilter(20, 0, grantWhere);

        await Promise.all(
          data?.grantCreateds?.map(
            async (grant: {
              levelInfo: {
                collectionIds: string[];
              };
            }) => {
              await Promise.all(
                grant?.levelInfo?.collectionIds?.map(async (coll: string) => {
                  const item =
                    collections?.find((item) => item.collectionId == coll) ||
                    collectedAwaited?.find((item) => item.collectionId == coll);

                  if (!item) {
                    const { data } = await getOneCollection(coll);

                    let newColl = data?.collectionCreateds?.[0];

                    if (!newColl?.grantMetadata) {
                      const fetch = await fetchIpfsJson(newColl?.uri);
                      newColl = {
                        ...newColl,
                        grantMetadata: fetch,
                      };
                    }

                    grantAwaited.push(newColl);
                  }
                })
              );
            }
          )
        );
      }

      setCollections([...collectedAwaited, ...grantAwaited]);
      setInfo({
        hasMore:
          collectedAwaited?.length > 20 || grantAwaited?.length > 20
            ? true
            : false,
        cursor:
          collectedAwaited?.length > 20 || grantAwaited?.length > 20 ? 20 : 0,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectionsLoading(false);
  };

  const handleCollections = async () => {
    try {
      const data = await getCollections(20, 0);

      const awaited = await Promise.all(
        data?.data?.collectionCreateds?.map(
          async (item: {
            pubId: string;
            profileId: string;
            collectionId: string;
            printType: string;
          }) => {
            const publication = await getPublication(
              {
                forId: `${toHexWithLeadingZero(
                  Number(item.profileId)
                )}-${toHexWithLeadingZero(Number(item.pubId))}`,
              },
              lensConnected?.id
            );
            const { data } = await getGrantsByCollectionId(
              Number(item?.collectionId)
            );

            const grants = await Promise.all(
              data?.collectionGrantIds?.[0]?.grants?.map(
                async (item: { grantMetadata: {}; uri: string }) => {
                  if (!item?.grantMetadata) {
                    const data = await fetchIpfsJson(item?.uri);
                    item = {
                      ...item,
                      grantMetadata: data,
                    };
                  }

                  return item;
                }
              )
            );
            return {
              ...item,
              publication: publication?.data?.publication,
              printType:
                printTypeToString[numberToPrintType[Number(item?.printType)]],
              grants,
            };
          }
        )
      );

      setCollections(awaited);
      setInfo({
        hasMore: awaited?.length > 20 ? true : false,
        cursor: awaited?.length > 20 ? 20 : 0,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreCollections = async () => {
    if (!info.hasMore) return;
    try {
      const data = await getCollections(20, info.cursor);

      const awaited = await Promise.all(
        data?.data?.collectionCreateds?.map(
          async (item: {
            pubId: string;
            profileId: string;
            collectionId: string;
            printType: string;
          }) => {
            const publication = await getPublication(
              {
                forId: `${toHexWithLeadingZero(
                  Number(item.profileId)
                )}-${toHexWithLeadingZero(Number(item.pubId))}`,
              },
              lensConnected?.id
            );

            const { data } = await getGrantsByCollectionId(
              Number(item?.collectionId)
            );

            const grants = await Promise.all(
              data?.collectionGrantIds?.[0]?.grants?.map(
                async (item: { grantMetadata: {}; uri: string }) => {
                  if (!item?.grantMetadata) {
                    const data = await fetchIpfsJson(item?.uri);
                    item = {
                      ...item,
                      grantMetadata: data,
                    };
                  }

                  return item;
                }
              )
            );

            return {
              ...item,
              publication: publication?.data?.publication,
              printType:
                printTypeToString[numberToPrintType[Number(item?.printType)]],
              grants,
            };
          }
        )
      );

      setCollections([...collections, ...(awaited || [])]);
      setInfo({
        hasMore: data?.data?.collectionCreateds?.length == 20 ? true : false,
        cursor:
          data?.data?.collectionCreateds?.length == 20 ? info.cursor + 20 : 0,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreFilteredCollections = async () => {
    if (!info?.hasMore) return;
    try {
      let collectionWhere = {
        and: [{ origin: 0 }],
      };
      let grantWhere = {};
      if (searchFilters?.printType?.length > 0) {
        const prints = searchFilters?.printType?.map((s) => ({
          printType: Number(
            printStringToNumber[s?.slice(0, 1).toUpperCase() + s?.slice(1)]
          ),
        }));
        if (searchFilters?.printType?.length > 1) {
          collectionWhere = {
            and: [
              ...(collectionWhere as any).and,
              {
                or: [...prints],
              },
            ],
          };
        } else {
          collectionWhere = {
            and: [...(collectionWhere as any).and, ...prints],
          };
        }
      }

      if (
        searchFilters?.designer?.trim() !== "" &&
        searchFilters?.designer?.trim() !== "@"
      ) {
        collectionWhere = {
          and: [
            ...(collectionWhere as any).and,
            { owner: searchFilters?.designerAddress },
          ],
        };
      }

      if (searchFilters?.grant?.trim() !== "") {
        grantWhere = {
          and: [
            ...(grantWhere as any).and,
            { grantMetadata_: { title_contains_nocase: searchFilters?.grant } },
          ],
        };
      }

      let collectedAwaited: PrintItem[] = [];
      let grantAwaited: PrintItem[] = [];

      if (collectionWhere?.and?.filter((item) => !item.origin)?.length > 0) {
        const { data } = await getCollectionsFilter(
          20,
          info.cursor,
          collectionWhere
        );

        collectedAwaited = await Promise.all(
          data?.collectionCreateds?.map(
            async (item: {
              pubId: string;
              profileId: string;
              collectionId: string;
              printType: string;
            }) => {
              const publication = await getPublication(
                {
                  forId: `${toHexWithLeadingZero(
                    Number(item.profileId)
                  )}-${toHexWithLeadingZero(Number(item.pubId))}`,
                },
                lensConnected?.id
              );
              const { data } = await getGrantsByCollectionId(
                Number(item?.collectionId)
              );

              const grants = await Promise.all(
                data?.collectionGrantIds?.[0]?.grants?.map(
                  async (item: { grantMetadata: {}; uri: string }) => {
                    if (!item?.grantMetadata) {
                      const data = await fetchIpfsJson(item?.uri);
                      item = {
                        ...item,
                        grantMetadata: data,
                      };
                    }

                    return item;
                  }
                )
              );
              return {
                ...item,
                publication: publication?.data?.publication,
                printType:
                  printTypeToString[numberToPrintType[Number(item?.printType)]],
                grants,
              };
            }
          )
        );
      }

      if (!isEmpty(Object.values(grantWhere))) {
        const { data } = await getGrantsByCollectionIdFilter(20, 0, grantWhere);

        await Promise.all(
          data?.grantCreateds?.map(
            async (grant: {
              levelInfo: {
                collectionIds: string[];
              };
            }) => {
              await Promise.all(
                grant?.levelInfo?.collectionIds?.map(async (coll: string) => {
                  const item =
                    collections?.find((item) => item.collectionId == coll) ||
                    collectedAwaited?.find((item) => item.collectionId == coll);

                  if (!item) {
                    const { data } = await getOneCollection(coll);

                    let newColl = data?.collectionCreateds?.[0];

                    if (!newColl?.grantMetadata) {
                      const fetch = await fetchIpfsJson(newColl?.uri);
                      newColl = {
                        ...newColl,
                        grantMetadata: fetch,
                      };
                    }

                    grantAwaited.push(newColl);
                  }
                })
              );
            }
          )
        );
      }

      setCollections([...collections, ...collectedAwaited, ...grantAwaited]);
      setInfo({
        hasMore:
          collectedAwaited?.length > 20 || grantAwaited?.length > 20
            ? true
            : false,
        cursor:
          collectedAwaited?.length > 20 || grantAwaited?.length > 20
            ? info.cursor + 20
            : 0,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (collections?.length < 1) {
      handleCollections();
    }
  }, []);

  useEffect(() => {
    if (collections?.length > 0) {
      handleCollectionsFilter();
    }
  }, [searchFilters?.designer, searchFilters?.grant, searchFilters?.printType]);

  return {
    searchFilters,
    setSearchFilters,
    handleMoreCollections,
    handleMoreFilteredCollections,
    collectionsLoading,
    collections,
    info,
    setCollections,
    setCaretCoord,
    mentionProfiles,
    setMentionProfiles,
    profilesOpen,
    setProfilesOpen,
    inputElement,
  };
};

export default useStore;
