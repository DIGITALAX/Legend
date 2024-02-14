import { useEffect, useState } from "react";

const useWho = () => {
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
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMirrors = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleComments = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleContributors = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreReacts = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreMirrors = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreComments = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMoreContributors = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleWho = async () => {
    setWhoLoading(true);
    switch (interactionState) {
      case "reacts":
        await handleReacts();

      case "mirrors":
        await handleMirrors();

      case "comments":
        await handleComments();

      default:
        await handleContributors();
    }
    setWhoLoading(false);
  };

  const handleMoreWho = async () => {
    if (!info.hasMore) return;

    switch (interactionState) {
      case "reacts":
        await handleMoreReacts();

      case "mirrors":
        await handleMoreMirrors();

      case "comments":
        await handleMoreComments();

      default:
        await handleMoreContributors();
    }
  };

  useEffect(() => {
    handleWho();
  }, [interactionState]);

  return {
    interactionState,
    setInteractionState,
    who,
    setWho,
    handleMoreWho,
    info,
    whoLoading,
  };
};

export default useWho;
