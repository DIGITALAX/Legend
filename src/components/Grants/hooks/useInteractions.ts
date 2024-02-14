import {
  Post,
  Profile,
  PublicationOperations,
  PublicationStats,
} from "../../../../graphql/generated";
import { Dispatch } from "redux";
import { SetStateAction, useEffect, useState } from "react";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { Grant } from "../types/grant.types";
import lensBookmark from "../../../../lib/lens/helpers/lensBookmark";
import lensMirror from "../../../../lib/lens/helpers/lensMirror";
import lensLike from "../../../../lib/lens/helpers/lensLike";
import errorChoice from "../../../../lib/lens/helpers/errorChoice";
import { setAllGrants } from "../../../../redux/reducers/allGrantsSlice";
import lensCollect from "../../../../lib/lens/helpers/lensCollect";
import { NextRouter } from "next/router";

const useInteractions = (
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  feed: Grant[],
  router: NextRouter,
  setGrant?: (e: SetStateAction<Grant | undefined>) => void
) => {
  const [mirrorChoiceOpen, setMirrorChoiceOpen] = useState<boolean[]>([]);
  const [mainMirrorChoiceOpen, setMainMirrorChoiceOpen] = useState<boolean[]>(
    []
  );
  const [interactionState, setInteractionState] =
    useState<string>("contributors");
  const [mainInteractionsLoading, setMainInteractionsLoading] = useState<
    {
      mirror: boolean;
      bookmark: boolean;
      like: boolean;
      unfollow: boolean[];
      follow: boolean[];
      simpleCollect: boolean;
    }[]
  >([
    {
      follow: [],
      unfollow: [],
      mirror: false,
      bookmark: false,
      like: false,
      simpleCollect: false,
    },
  ]);
  const [profileHovers, setProfileHovers] = useState<boolean[]>([]);
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      mirror: boolean;
      bookmark: boolean;
      like: boolean;
      unfollow: boolean[];
      follow: boolean[];
      simpleCollect: boolean;
    }[]
  >([]);

  const bookmark = async (id: string, main?: boolean) => {
    if (!lensConnected?.id) return;

    let index = 0;

    if (!main) {
      index = feed?.findIndex((pub) => pub?.publication?.id === id) as number;

      if (index == -1) {
        return;
      }
    }

    if (main) {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        bookmark: true,
      }));
    } else {
      setInteractionsLoading((prev) => {
        const old = [...prev];
        old[index] = {
          ...old[index],
          bookmark: true,
        };
        return old;
      });
    }

    try {
      await lensBookmark(id, dispatch);
      updateInteractions(
        index!,
        {
          hasBookmarked: true,
        },
        "bookmarks",
        true
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index!,
            {
              hasBookmarked: true,
            },
            "bookmarks",
            true
          ),
        dispatch
      );
    }

    if (main) {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        bookmark: false,
      }));
    } else {
      setInteractionsLoading((prev) => {
        const old = [...prev];
        old[index] = {
          ...old[index],
          bookmark: false,
        };
        return old;
      });
    }
  };

  const mirror = async (id: string, main?: boolean) => {
    if (!lensConnected?.id) return;

    let index = 0;

    if (!main) {
      index = feed?.findIndex((pub) => pub?.publication?.id === id) as number;

      if (index == -1) {
        return;
      }
    }

    if (main) {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        mirror: true,
      }));
    } else {
      setInteractionsLoading((prev) => {
        const old = [...prev];
        old[index] = {
          ...old[index],
          mirror: true,
        };
        return old;
      });
    }

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      await lensMirror(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      updateInteractions(
        index!,
        {
          hasMirrored: true,
        },
        "mirrors",
        true
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index!,
            {
              hasMirrored: true,
            },
            "mirrors",
            true
          ),
        dispatch
      );
    }

    if (main) {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        mirror: false,
      }));
    } else {
      setInteractionsLoading((prev) => {
        const old = [...prev];
        old[index] = {
          ...old[index],
          mirror: false,
        };
        return old;
      });
    }
  };

  const like = async (id: string, hasReacted: boolean, main?: boolean) => {
    if (!lensConnected?.id) return;

    let index = 0;

    if (!main) {
      index = feed?.findIndex((pub) => pub?.publication?.id === id) as number;

      if (index == -1) {
        return;
      }
    }

    if (main) {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        like: true,
      }));
    } else {
      setInteractionsLoading((prev) => {
        const old = [...prev];
        old[index] = {
          ...old[index],
          like: true,
        };
        return old;
      });
    }

    try {
      await lensLike(id, dispatch, hasReacted!);
      updateInteractions(
        index!,
        {
          hasReacted: hasReacted ? false : true,
        },
        "reactions",
        hasReacted ? false : true
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index!,
            {
              hasReacted: hasReacted ? false : true,
            },
            "reactions",
            hasReacted ? false : true
          ),
        dispatch
      );
    }

    if (main) {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        like: false,
      }));
    } else {
      setInteractionsLoading((prev) => {
        const old = [...prev];
        old[index] = {
          ...old[index],
          like: false,
        };
        return old;
      });
    }
  };

  const simpleCollect = async (id: string, type: string, main?: boolean) => {
    if (!lensConnected?.id) return;

    let index = 0;

    if (!main) {
      index = feed?.findIndex((pub) => pub?.publication?.id === id) as number;

      if (index == -1) {
        return;
      }
    }

    if (main) {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        simpleCollect: true,
      }));
    } else {
      setInteractionsLoading((prev) => {
        const old = [...prev];
        old[index] = {
          ...old[index],
          simpleCollect: true,
        };
        return old;
      });
    }

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensCollect(
        id,
        type,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );

      updateInteractions(
        index,
        {
          hasActed: {
            __typename: "OptimisticStatusResult",
            isFinalisedOnchain: true,
            value: true,
          },
        },
        "countOpenActions",
        true
      );
    } catch (err: any) {
      console.error(err.message);
    }

    if (main) {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        simpleCollect: false,
      }));
    } else {
      setInteractionsLoading((prev) => {
        const old = [...prev];
        old[index] = {
          ...old[index],
          simpleCollect: false,
        };
        return old;
      });
    }
  };

  const updateInteractions = (
    index: number,
    value: Object,
    type: string,
    increase: boolean
  ) => {
    if (!feed) return;
    const newItems = [...feed];

    if (index !== -1 && newItems[index]?.publication) {
      newItems[index] = {
        ...newItems[index],
        publication: {
          ...(newItems[index]?.publication as Post),
          operations: {
            ...newItems[index]?.publication?.operations,
            ...value,
          } as PublicationOperations,
          stats: {
            ...newItems[index]?.publication?.stats,
            [type]:
              newItems[index]?.publication?.stats?.[
                type as keyof PublicationStats
              ] + (increase ? 1 : -1),
          } as PublicationStats,
        },
      };
    }

    if (router.asPath == "/") {
      dispatch(setAllGrants(newItems));
    } else {
      setGrant!(newItems[0]);
    }
  };

  useEffect(() => {
    if (feed?.length > 0) {
      setInteractionsLoading(
        Array.from({ length: feed?.length }, () => ({
          mirror: false,
          bookmark: false,
          like: false,
          follow: [],
          unfollow: [],
          simpleCollect: false,
        }))
      );
      setMirrorChoiceOpen(Array.from({ length: feed?.length }, () => false));
      setProfileHovers(Array.from({ length: feed?.length }, () => false));
      setMainMirrorChoiceOpen([false]);
    }
  }, [feed?.length]);

  return {
    mirror,
    like,
    bookmark,
    interactionsLoading,
    mirrorChoiceOpen,
    setMirrorChoiceOpen,
    profileHovers,
    setProfileHovers,
    simpleCollect,
    mainInteractionsLoading,
    interactionState,
    setInteractionState,
    mainMirrorChoiceOpen,
    setMainMirrorChoiceOpen,
  };
};

export default useInteractions;
