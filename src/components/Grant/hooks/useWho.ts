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
  }>({
    hasMore: true,
    cursor: undefined,
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
