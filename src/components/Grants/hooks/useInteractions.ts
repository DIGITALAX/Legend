import {
  Comment,
  Post,
  Profile,
  PublicationOperations,
  PublicationStats,
  SimpleCollectOpenActionSettings,
} from "../../../../graphql/generated";
import { Dispatch } from "redux";
import { useEffect, useState } from "react";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { Grant } from "../types/grant.types";
import lensBookmark from "../../../../lib/lens/helpers/lensBookmark";
import lensMirror from "../../../../lib/lens/helpers/lensMirror";
import lensLike from "../../../../lib/lens/helpers/lensLike";
import errorChoice from "../../../../lib/lens/helpers/errorChoice";
import lensFollow from "../../../../lib/lens/helpers/lensFollow";
import refetchProfile from "../../../../lib/lens/helpers/refetchProfile";
import lensUnfollow from "../../../../lib/lens/helpers/lensUnfollow";
import { setAllGrants } from "../../../../redux/reducers/allGrantsSlice";

const useInteractions = (
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  feed?: Grant[]
) => {
  const [mirrorChoiceOpen, setMirrorChoiceOpen] = useState<boolean[]>([]);
  const [mainInteractionsLoading, setMainInteractionsLoading] = useState<{
    mirror: boolean;
    bookmark: boolean;
    like: boolean;
    unfollow: boolean[];
    follow: boolean[];
  }>({
    follow: [],
    unfollow: [],
    mirror: false,
    bookmark: false,
    like: false,
  });
  const [profileHovers, setProfileHovers] = useState<boolean[]>([]);
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      mirror: boolean;
      bookmark: boolean;
      like: boolean;
      unfollow: boolean[];
      follow: boolean[];
    }[]
  >([]);

  const bookmark = async (id: string) => {
    if (!lensConnected?.id) return;

    const index = feed?.findIndex((pub) => pub?.publication?.id === id);

    if (index == -1) {
      return;
    }

    try {
      await lensBookmark(id, dispatch);
      updateInteractions(
        index!,
        {
          hasBookmarked: true,
        },
        "bookmarks"
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
            "bookmarks"
          ),
        dispatch
      );
    }
  };

  const mirror = async (id: string, main?: boolean) => {
    if (!lensConnected?.id) return;

    let index = 0;

    if (!main) {
      index = feed?.findIndex((pub) => pub?.publication?.id === id)!;

      if (index == -1) {
        return;
      }
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], mirror: true };
      return updatedArray;
    });

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
        "mirrors"
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
            "mirrors"
          ),
        dispatch
      );
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], mirror: false };
      return updatedArray;
    });
  };

  const like = async (id: string, hasReacted: boolean, main?: boolean) => {
    if (!lensConnected?.id) return;

    let index = 0;

    if (!main) {
      index = feed?.findIndex((pub) => pub?.publication?.id === id)!;

      if (index == -1) {
        return;
      }
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], like: true };
      return updatedArray;
    });

    try {
      await lensLike(id, dispatch, hasReacted!);
      updateInteractions(
        index!,
        {
          hasReacted: hasReacted ? false : true,
        },
        "reactions"
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
            "reactions"
          ),
        dispatch
      );
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], like: false };
      return updatedArray;
    });
  };

  const followProfile = async (
    id: string,
    index: number,
    innerIndex: number,
    main?: boolean
  ) => {
    if (!lensConnected?.id) return;

    if (index == -1) {
      return;
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const old = { ...prev };
        old.follow[innerIndex] = true;
        return old;
      });
    } else {
      setInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!] };
        updatedArray[index!].follow[innerIndex] = true;
        return updatedArray;
      });
    }

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensFollow(
        id,
        dispatch,
        undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      errorChoice(err, () => {}, dispatch);
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const old = { ...prev };
        old.follow[innerIndex] = false;
        return old;
      });
    } else {
      setInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!] };
        updatedArray[index!].unfollow[innerIndex] = false;
        return updatedArray;
      });
    }
  };

  const unfollowProfile = async (
    id: string,
    index: number,
    innerIndex: number,
    main?: boolean
  ) => {
    if (!lensConnected?.id) return;

    if (index == -1) {
      return;
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const old = { ...prev };
        old.unfollow[innerIndex] = true;
        return old;
      });
    } else {
      setInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!] };
        updatedArray[index!].unfollow[innerIndex] = true;
        return updatedArray;
      });
    }

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensUnfollow(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      errorChoice(err, () => {}, dispatch);
    }
    if (main) {
      setMainInteractionsLoading((prev) => {
        const old = { ...prev };
        old.unfollow[innerIndex] = false;
        return old;
      });
    } else {
      setInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!] };
        updatedArray[index!].unfollow[innerIndex] = false;
        return updatedArray;
      });
    }
  };

  const updateInteractions = (index: number, value: Object, type: string) => {
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
              ] + 1,
          } as PublicationStats,
        },
      };
    }

    dispatch(setAllGrants(newItems));
  };

  useEffect(() => {
    if (feed) {
      setInteractionsLoading(
        Array.from({ length: feed?.length }, () => ({
          mirror: false,
          bookmark: false,
          like: false,
          follow: [],
          unfollow: [],
        }))
      );
      setMirrorChoiceOpen(Array.from({ length: feed?.length }, () => false));
      setProfileHovers(Array.from({ length: feed?.length }, () => false));
    }
  }, [feed]);

  return {
    mirror,
    like,
    bookmark,
    interactionsLoading,
    mirrorChoiceOpen,
    setMirrorChoiceOpen,
    profileHovers,
    setProfileHovers,
    followProfile,
    unfollowProfile,
    mainInteractionsLoading,
  };
};

export default useInteractions;
