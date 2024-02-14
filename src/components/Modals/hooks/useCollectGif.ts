import { Erc20, LimitType, Profile } from "../../../../graphql/generated";
import { setAvailableCurrencies } from "../../../../redux/reducers/availableCurrenciesSlice";
import { Dispatch } from "redux";
import {
  PostCollectGifState,
  setPostCollectGif,
} from "../../../../redux/reducers/postCollectGifSlice";
import { PublicClient, createWalletClient, custom } from "viem";
import uploadPostContent from "../../../../lib/lens/helpers/uploadPostContent";
import { polygon } from "viem/chains";
import { PostState, setPost } from "../../../../redux/reducers/postSlice";
import { useEffect, useState } from "react";
import lensPost from "../../../../lib/lens/helpers/lensPost";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import { MakePostComment } from "@/components/Common/types/common.types";
import getEnabledCurrencies from "../../../../graphql/lens/queries/enabledCurrencies";
import { setErrorModal } from "../../../../redux/reducers/errorModalSlice";
import lensQuote from "../../../../lib/lens/helpers/lensQuote";

const useCollectGif = (
  availableCurrencies: Erc20[],
  lensConnected: Profile | undefined,
  postCollectGif: PostCollectGifState,
  postBox: PostState,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined
) => {
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [profilesOpen, setProfilesOpen] = useState<boolean[]>([false]);
  const [caretCoord, setCaretCoord] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [quoteLoading, setQuoteLoading] = useState<boolean[]>([false]);
  const [makeQuote, setMakeQuote] = useState<MakePostComment[]>([
    {
      content: "",
      images: [],
      videos: [],
    },
  ]);
  const [quoteContentLoading, setQuoteContentLoading] = useState<
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
  const [searchGifLoading, setSearchGifLoading] = useState<boolean>(false);
  const [openMeasure, setOpenMeasure] = useState<{
    searchedGifs: string[];
    search: string;
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  }>({
    searchedGifs: [],
    search: "",
    award: "No",
    whoCollectsOpen: false,
    creatorAwardOpen: false,
    currencyOpen: false,
    editionOpen: false,
    edition: "",
    timeOpen: false,
    time: "",
  });

  const quote = async () => {
    if (!lensConnected?.id) return;
    if (
      !makeQuote[0]?.content &&
      !makeQuote[0]?.images &&
      !makeQuote[0]?.videos &&
      postCollectGif?.gifs?.[postBox?.quote?.id]
    )
      return;
    setQuoteLoading([true]);

    try {
      const contentURI = await uploadPostContent(
        makeQuote[0]?.content?.trim() == "" ? " " : makeQuote[0]?.content,
        makeQuote[0]?.images || [],
        makeQuote[0]?.videos || [],
        [],
        postCollectGif.gifs?.[postBox?.quote?.id] || []
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      if (postBox?.quote) {
        await lensQuote(
          postBox?.quote?.id,
          contentURI?.string!,
          dispatch,
          postCollectGif.collectTypes?.[postBox?.quote?.id]
            ? [
                {
                  collectOpenAction: {
                    simpleCollectOpenAction:
                      postCollectGif.collectTypes?.[postBox?.quote?.id]!,
                  },
                },
              ]
            : undefined,
          address as `0x${string}`,
          clientWallet,
          publicClient,
          () => clearBox()
        );
      } else {
        await lensPost(
          contentURI?.string!,
          dispatch,
          postCollectGif.collectTypes?.[postBox?.quote?.id || "post"]
            ? [
                {
                  collectOpenAction: {
                    simpleCollectOpenAction:
                      postCollectGif.collectTypes?.[
                        postBox?.quote?.id || "post"
                      ]!,
                  },
                },
              ]
            : undefined,
          address as `0x${string}`,
          clientWallet,
          publicClient,
          () => clearBox()
        );
      }

      const gifs = { ...postCollectGif.gifs };
      delete gifs[postBox?.quote?.id];
      const cts = { ...postCollectGif.collectTypes };
      delete cts[postBox?.quote?.id];
      dispatch(
        setPostCollectGif({
          actionCollectType: cts,
          actionGifs: gifs,
        })
      );
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) {
        setQuoteLoading([false]);
        return;
      }
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        dispatch(
          setErrorModal({
            actionValue: true,
            actionMessage:
              "Something went wrong indexing your interaction. Try again?",
          })
        );
        console.error(err.message);
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Successfully Indexed",
          })
        );

        setTimeout(() => {
          dispatch(
            setIndexer({
              actionOpen: false,
              actionMessage: undefined,
            })
          );
        }, 3000);
      }
    }

    setQuoteLoading([false]);
  };

  const getCurrencies = async (): Promise<void> => {
    try {
      const response = await getEnabledCurrencies({
        limit: LimitType.TwentyFive,
      });

      if (response && response.data) {
        dispatch(setAvailableCurrencies(response.data.currencies.items));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const clearBox = () => {
    setMakeQuote([
      {
        content: "",
        images: [],
        videos: [],
      },
    ]);
    dispatch(
      setPost({
        actionOpen: false,
      })
    );
    setQuoteLoading([false]);
  };

  const handleGif = async (search: string) => {
    try {
      setSearchGifLoading(true);
      const response = await fetch("/api/giphy", {
        method: "POST",
        body: search,
      });
      const allGifs = await response.json();
      setOpenMeasure((prev) => ({
        ...prev,
        searchedGifs: allGifs?.json?.results,
      }));
      setSearchGifLoading(false);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (availableCurrencies?.length < 1) {
      getCurrencies();
    }
  }, []);

  useEffect(() => {
    if (postCollectGif.type) {
      if (postCollectGif.collectTypes?.[postCollectGif?.id!]) {
        setOpenMeasure((prev) => ({
          ...prev,
          award:
            postCollectGif.collectTypes?.[postCollectGif?.id!]?.amount?.value ||
            Number(
              postCollectGif.collectTypes?.[postCollectGif?.id!]?.amount?.value
            )
              ? "Yes"
              : "No",
          whoCollectsOpen: false,
          creatorAwardOpen: false,
          currencyOpen: false,
          editionOpen: false,
          edition: postCollectGif.collectTypes?.[postCollectGif?.id!]
            ?.collectLimit
            ? "Yes"
            : "No",
          timeOpen: false,
          time: postCollectGif.collectTypes?.[postCollectGif?.id!]?.endsAt
            ? "Yes"
            : "No",
        }));
      }
    }
  }, [postCollectGif.type]);

  return {
    quote,
    quoteLoading,
    setMakeQuote,
    makeQuote,
    quoteContentLoading,
    setQuoteContentLoading,
    openMeasure,
    setOpenMeasure,
    searchGifLoading,
    handleGif,
    mentionProfiles,
    setMentionProfiles,
    caretCoord,
    setCaretCoord,
    setProfilesOpen,
    profilesOpen,
  };
};

export default useCollectGif;
