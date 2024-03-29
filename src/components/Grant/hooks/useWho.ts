import { useEffect, useState } from "react";
import whoReactedPublication from "../../../../graphql/lens/queries/whoReacted";
import { LimitType, Profile } from "../../../../graphql/generated";
import getPublications from "../../../../graphql/lens/queries/publications";
import whoActedPublication from "../../../../graphql/lens/queries/whoActed";

const useWho = (id: string, lensConnected: Profile | undefined) => {
  const [whoLoading, setWhoLoading] = useState<boolean>(false);
  const [interactionState, setInteractionState] =
    useState<string>("contributors");
  const [info, setInfo] = useState<{
    hasMore: boolean;
    cursor: string | undefined;
    cursorQuote?: string | undefined;
  }>({
    hasMore: true,
    cursor: undefined,
    cursorQuote: undefined,
  });
  const [who, setWho] = useState<any[]>([]);

  const handleReacts = async () => {
    try {
      const { data } = await whoReactedPublication({
        for: id,
        limit: LimitType.Ten,
      });

      setWho(data?.whoReactedPublication?.items || []);

      setInfo({
        hasMore:
          data?.whoReactedPublication?.items?.length == 10 ? true : false,
        cursor:
          data?.whoReactedPublication?.items?.length == 10
            ? data?.whoReactedPublication?.pageInfo?.next
            : undefined,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMirrors = async () => {
    try {
      const { data } = await getPublications(
        {
          where: {
            mirrorOn: id,
          },
          limit: LimitType.Ten,
        },
        lensConnected?.id
      );

      const quoteData = await getPublications(
        {
          where: {
            quoteOn: id,
          },
          limit: LimitType.Ten,
          cursor: info?.cursor,
        },
        lensConnected?.id
      );

      setWho(
        [
          ...(data?.publications?.items || []),
          ...(quoteData?.data?.publications?.items || []),
        ].sort(() => Math.random() - 0.5)
      );

      setInfo({
        hasMore:
          data?.publications?.items?.length == 10 ||
          quoteData?.data?.publications?.items?.length == 10
            ? true
            : false,
        cursor:
          data?.publications?.items?.length == 10
            ? data?.publications?.pageInfo?.next
            : undefined,
        cursorQuote:
          quoteData?.data?.publications?.items?.length == 10
            ? quoteData?.data?.publications?.pageInfo?.next
            : undefined,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleComments = async () => {
    try {
      const { data } = await getPublications(
        {
          where: {
            commentOn: {
              id,
            },
          },
          limit: LimitType.Ten,
        },
        lensConnected?.id
      );

      setWho(data?.publications?.items || []);
      setInfo({
        hasMore: data?.publications?.items?.length == 10 ? true : false,
        cursor:
          data?.publications?.items?.length == 10
            ? data?.publications?.pageInfo?.next
            : undefined,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleContributors = async () => {
    try {
      const { data } = await whoActedPublication(
        {
          on: id,
          limit: LimitType.Ten,
        },
        lensConnected?.id
      );

      setWho(data?.whoActedOnPublication?.items || []);

      setInfo({
        hasMore:
          data?.whoActedOnPublication?.items?.length == 10 ? true : false,
        cursor:
          data?.whoActedOnPublication?.items?.length == 10
            ? data?.whoActedOnPublication?.pageInfo?.next
            : undefined,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreReacts = async () => {
    try {
      const { data } = await whoReactedPublication({
        for: id,
        limit: LimitType.Ten,
        cursor: info.cursor,
      });

      setWho([...who, ...(data?.whoReactedPublication?.items || [])]);

      setInfo({
        hasMore:
          data?.whoReactedPublication?.items?.length == 10 ? true : false,
        cursor:
          data?.whoReactedPublication?.items?.length == 10
            ? data?.whoReactedPublication?.pageInfo?.next
            : undefined,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreMirrors = async () => {
    try {
      let mirrorData: any[] = [],
        quoteData: any[] = [],
        quoteNext: string | undefined,
        mirrorNext: string | undefined;
      if (info?.cursor) {
        const { data } = await getPublications(
          {
            where: {
              mirrorOn: id,
            },
            limit: LimitType.Ten,
            cursor: info?.cursor,
          },
          lensConnected?.id
        );

        mirrorData = data?.publications?.items as any[];
        mirrorNext = data?.publications?.pageInfo?.next;
      }

      if (info?.cursorQuote) {
        const { data } = await getPublications(
          {
            where: {
              quoteOn: id,
            },
            limit: LimitType.Ten,
            cursor: info?.cursorQuote,
          },
          lensConnected?.id
        );

        quoteData = data?.publications?.items as any[];
        quoteNext = data?.publications?.pageInfo?.next;
      }

      setWho(
        [...who, ...[...(mirrorData || []), ...(quoteData || [])]].sort(
          () => Math.random() - 0.5
        )
      );

      setInfo({
        hasMore:
          mirrorData?.length == 10 || quoteData?.length == 10 ? true : false,
        cursor: mirrorData?.length == 10 ? mirrorNext : undefined,
        cursorQuote: quoteData?.length == 10 ? quoteNext : undefined,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreComments = async () => {
    try {
      const { data } = await getPublications(
        {
          where: {
            commentOn: {
              id,
            },
          },
          limit: LimitType.Ten,
          cursor: info?.cursor,
        },
        lensConnected?.id
      );

      setWho([...who, ...(data?.publications?.items || [])]);

      setInfo({
        hasMore: data?.publications?.items?.length == 10 ? true : false,
        cursor:
          data?.publications?.items?.length == 10
            ? data?.publications?.pageInfo?.next
            : undefined,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreContributors = async () => {
    try {
      const { data } = await whoActedPublication(
        {
          on: id,
          limit: LimitType.Ten,
          cursor: info?.cursor,
        },
        lensConnected?.id
      );

      setWho([...who, ...(data?.whoActedOnPublication?.items || [])]);

      setInfo({
        hasMore:
          data?.whoActedOnPublication?.items?.length == 10 ? true : false,
        cursor:
          data?.whoActedOnPublication?.items?.length == 10
            ? data?.whoActedOnPublication?.pageInfo?.next
            : undefined,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleWho = async () => {
    setWhoLoading(true);
    setWho([]);
    switch (interactionState) {
      case "reacts":
        await handleReacts();
        break;

      case "mirrors":
        await handleMirrors();
        break;

      case "comments":
        await handleComments();
        break;

      default:
        await handleContributors();
        break;
    }
    setWhoLoading(false);
  };

  const handleMoreWho = async () => {
    if (!info.hasMore) return;

    switch (interactionState) {
      case "reacts":
        await handleMoreReacts();
        break;

      case "mirrors":
        await handleMoreMirrors();
        break;

      case "comments":
        await handleMoreComments();
        break;

      default:
        await handleMoreContributors();
        break;
    }
  };

  useEffect(() => {
    if (id) {
      handleWho();
    }
  }, [interactionState, id]);

  return {
    interactionState,
    setInteractionState,
    who,
    setWho,
    handleMoreWho,
    info,
    handleComments,
    whoLoading,
  };
};

export default useWho;
