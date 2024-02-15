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
import { MakePostComment } from "@/components/Common/types/common.types";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";
import uploadPostContent from "../../../../lib/lens/helpers/uploadPostContent";
import lensComment from "../../../../lib/lens/helpers/lensComment";

const useInteractions = (
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  router: NextRouter,
  feed: (Grant | Post)[],
  grant?: Grant[],
  setGrant?: (e: SetStateAction<Grant | undefined>) => void,
  setWho?: (e: SetStateAction<Post[]>) => void,
  getComments?: () => Promise<void>,
  postCollectGif?: PostCollectGifState
) => {
  const [mainContentLoading, setMainContentLoading] = useState<
    {
      image: boolean;
      video: boolean;
    }[]
  >([
    {
      image: false,
      video: false,
    },
  ]);
  const [contentLoading, setContentLoading] = useState<
    {
      image: boolean;
      video: boolean;
    }[]
  >([]);
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [profilesOpen, setProfilesOpen] = useState<boolean[]>([]);
  const [caretCoord, setCaretCoord] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [mainMentionProfiles, setMainMentionProfiles] = useState<Profile[]>([]);
  const [mainProfilesOpen, setMainProfilesOpen] = useState<boolean[]>([]);
  const [mainCaretCoord, setMainCaretCoord] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [makeComment, setMakeComment] = useState<MakePostComment[]>([]);
  const [mainMakeComment, setMainMakeComment] = useState<MakePostComment[]>([
    {
      content: "",
      images: [],
      videos: [],
    },
  ]);
  const [mirrorChoiceOpen, setMirrorChoiceOpen] = useState<boolean[]>([]);
  const [commentBoxOpen, setCommentBoxOpen] = useState<boolean[]>([]);
  const [mainMirrorChoiceOpen, setMainMirrorChoiceOpen] = useState<boolean[]>([
    false,
  ]);
  const [mainInteractionsLoading, setMainInteractionsLoading] = useState<
    {
      mirror: boolean;
      bookmark: boolean;
      like: boolean;
      simpleCollect: boolean;
      comment: boolean;
    }[]
  >([
    {
      mirror: false,
      bookmark: false,
      like: false,
      simpleCollect: false,
      comment: false,
    },
  ]);
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      mirror: boolean;
      bookmark: boolean;
      like: boolean;
      simpleCollect: boolean;
      comment: boolean;
    }[]
  >([]);

  const bookmark = async (id: string, main?: boolean) => {
    if (!lensConnected?.id) return;

    let index = 0;

    if (!main) {
      index = feed?.findIndex(
        (pub) =>
          (!router.asPath.includes("/grant/") || main
            ? (pub as Grant)?.publication?.id
            : (pub as Post)?.id) === id
      ) as number;

      if (index == -1) {
        return;
      }
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          bookmark: true,
        };
        return arr;
      });
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
        true,
        main!
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
            true,
            main!
          ),
        dispatch
      );
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          bookmark: false,
        };
        return arr;
      });
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
      index = feed?.findIndex(
        (pub) =>
          (!router.asPath.includes("/grant/") || main
            ? (pub as Grant)?.publication?.id
            : (pub as Post)?.id) === id
      ) as number;

      if (index == -1) {
        return;
      }
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          mirror: true,
        };
        return arr;
      });
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
        true,
        main!
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
            true,
            main!
          ),
        dispatch
      );
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          mirror: false,
        };
        return arr;
      });
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
      index = feed?.findIndex(
        (pub) =>
          (!router.asPath.includes("/grant/") || main
            ? (pub as Grant)?.publication?.id
            : (pub as Post)?.id) === id
      ) as number;

      if (index == -1) {
        return;
      }
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          like: true,
        };
        return arr;
      });
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
        hasReacted ? false : true,
        main!
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
            hasReacted ? false : true,
            main!
          ),
        dispatch
      );
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          like: false,
        };
        return arr;
      });
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
      index = feed?.findIndex(
        (pub) =>
          (!router.asPath.includes("/grant/") || main
            ? (pub as Grant)?.publication?.id
            : (pub as Post)?.id) === id
      ) as number;

      if (index == -1) {
        return;
      }
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          simpleCollect: true,
        };
        return arr;
      });
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
        true,
        main!
      );
    } catch (err: any) {
      console.error(err.message);
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          simpleCollect: false,
        };
        return arr;
      });
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
    increase: boolean,
    main: boolean
  ) => {
    if (router.asPath.includes("/grant/") && !main) {
      let newItems = [...feed];
      if (index !== -1) {
        newItems[index] = {
          ...newItems[index],
          ...newItems[index],
          operations: {
            ...(newItems[index] as Post)?.operations,
            ...value,
          } as PublicationOperations,
          stats: {
            ...(newItems[index] as Post)?.stats,
            [type]:
              (newItems[index] as Post)?.stats?.[
                type as keyof PublicationStats
              ] + (increase ? 1 : -1),
          } as PublicationStats,
        };
      }
      setWho!(newItems as Post[]);
    } else {
      let newItems = [...((main ? grant : feed) || [])];
      if (index !== -1 && (newItems[index] as Grant)?.publication) {
        newItems[index] = {
          ...newItems[index],
          publication: {
            ...((newItems[index] as Grant)?.publication as Post),
            operations: {
              ...(newItems[index] as Grant)?.publication?.operations,
              ...value,
            } as PublicationOperations,
            stats: {
              ...(newItems[index] as Grant)?.publication?.stats,
              [type]:
                (newItems[index] as Grant)?.publication?.stats?.[
                  type as keyof PublicationStats
                ] + (increase ? 1 : -1),
            } as PublicationStats,
          },
        };
      }

      if (router.asPath == "/") {
        dispatch(setAllGrants(newItems as Grant[]));
      } else {
        if (!router.asPath.includes("/grant/")) {
          setWho!(newItems as any[]);
        } else {
          setGrant!(newItems[0] as Grant);
        }
      }
    }
  };

  const comment = async (id: string, main?: boolean) => {
    if (!lensConnected?.id) return;
    let content: string | undefined,
      images:
        | {
            media: string;
            type: string;
          }[]
        | undefined,
      videos: string[] | undefined;

    let index = 0;

    if (!main) {
      index = feed?.findIndex(
        (pub) =>
          (!router.asPath.includes("/grant/") || main
            ? (pub as Grant)?.publication?.id
            : (pub as Post)?.id) === id
      ) as number;

      if (index == -1) {
        return;
      }
    }

    if (!main) {
      if (
        (!makeComment[index!]?.content &&
          !makeComment[index!]?.images &&
          !makeComment[index!]?.videos &&
          !postCollectGif?.gifs?.[id]) ||
        index == -1
      )
        return;
      content = makeComment[index!]?.content;
      images = makeComment[index!]?.images!;
      videos = makeComment[index!]?.videos!;
    } else {
      if (
        !mainMakeComment[0]?.content &&
        !mainMakeComment[0]?.images &&
        !mainMakeComment[0]?.videos &&
        !postCollectGif?.gifs?.[id]
      )
        return;
      content = mainMakeComment[0]?.content;
      images = mainMakeComment[0]?.images!;
      videos = mainMakeComment[0]?.videos!;
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          comment: true,
        };
        return arr;
      });
    } else {
      setInteractionsLoading((prev) => {
        const old = [...prev];
        old[index] = {
          ...old[index],
          comment: true,
        };
        return old;
      });
    }

    try {
      const contentURI = await uploadPostContent(
        content?.trim() == "" ? " " : content,
        images || [],
        videos || [],
        [],
        postCollectGif?.gifs?.[id] || []
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensComment(
        id,
        contentURI?.string!,
        dispatch,
        postCollectGif?.collectTypes?.[id]
          ? [
              {
                collectOpenAction: {
                  simpleCollectOpenAction: postCollectGif?.collectTypes?.[id],
                },
              },
            ]
          : undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient,
        () => clearComment(index, main!)
      );
      updateInteractions(index!, {}, "comments", true, main!);
      await getComments!();
    } catch (err: any) {
      errorChoice(
        err,
        () => updateInteractions(index!, {}, "comments", true, main!),
        dispatch
      );
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          comment: false,
        };
        return arr;
      });
    } else {
      setInteractionsLoading((prev) => {
        const old = [...prev];
        old[index] = {
          ...old[index],
          comment: false,
        };
        return old;
      });
    }
  };

  const clearComment = async (index: number | undefined, main: boolean) => {
    if (!main) {
      setMakeComment((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = {
          content: "",
          images: [],
          videos: [],
        };
        return updatedArray;
      });
      setCommentBoxOpen((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = !updatedArray[index!];
        return updatedArray;
      });
    } else {
      setMainMakeComment((prev) => {
        const updatedArr = [...prev];
        updatedArr[0] = {
          content: "",
          images: [],
          videos: [],
        };
        return updatedArr;
      });
    }
  };

  useEffect(() => {
    if (feed && feed?.length > 0) {
      setInteractionsLoading(
        Array.from({ length: feed?.length }, () => ({
          mirror: false,
          bookmark: false,
          like: false,
          simpleCollect: false,
          comment: false,
        }))
      );
      setProfilesOpen(Array.from({ length: feed?.length }, () => false));
      setMakeComment(
        Array.from({ length: feed?.length }, () => ({
          content: "",
          images: [],
          videos: [],
        }))
      );
      setContentLoading(
        Array.from({ length: feed?.length }, () => ({
          image: false,
          video: false,
        }))
      );
      setCommentBoxOpen(Array.from({ length: feed?.length }, () => false));
      setMirrorChoiceOpen(Array.from({ length: feed?.length }, () => false));
    }
  }, [feed?.length]);

  return {
    mirror,
    like,
    bookmark,
    interactionsLoading,
    mirrorChoiceOpen,
    setMirrorChoiceOpen,
    simpleCollect,
    mainInteractionsLoading,
    mainMirrorChoiceOpen,
    setMainMirrorChoiceOpen,
    setCommentBoxOpen,
    commentBoxOpen,
    makeComment,
    setCaretCoord,
    caretCoord,
    mainCaretCoord,
    setMainCaretCoord,
    setMakeComment,
    setMainMakeComment,
    mainMakeComment,
    mentionProfiles,
    setMentionProfiles,
    setMainMentionProfiles,
    mainMentionProfiles,
    profilesOpen,
    mainProfilesOpen,
    setMainProfilesOpen,
    setProfilesOpen,
    comment,
    setContentLoading,
    contentLoading,
    mainContentLoading,
    setMainContentLoading,
  };
};

export default useInteractions;
