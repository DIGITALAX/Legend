import {
  LENS_HUB_PROXY_ADDRESS_MATIC,
  LENS_HUB_PROXY_ADDRESS_MUMBAI,
} from "@/lib/constants";
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi";
import LensHubProxy from "../../../abi/LensHubProxy.json";
import { RootState } from "@/redux/store";
import { waitForTransaction } from "@wagmi/core";
import {
  Erc20,
  MediaType,
  Profile,
  UploadedMedia,
} from "@/components/home.types";
import getCaretPos from "@/lib/lens/helpers/getCaretPos";
import getPostHTML from "@/lib/lens/helpers/getPostHTML";
import uploadPostContent from "@/lib/lens/helpers/uploadPostContent";
import { setIndexModal } from "@/redux/reducers/indexSlice";
import handleIndexCheck from "@/lib/lens/helpers/handleIndexCheck";
import broadcast from "@/graphql/lens/mutate/broadcast";
import omit from "@/lib/lens/helpers/omit";
import useImageUpload from "./useImageUpload";
import { setPublicationImages } from "@/redux/reducers/publicationImageSlice";
import { searchProfile } from "@/graphql/lens/query/searchProfile";
import {
  createDispatcherPostData,
  createPostTypedData,
} from "@/graphql/lens/mutate/post";
import splitSignature from "@/lib/lens/helpers/splitSignature";
import availableCurrencies from "@/lib/lens/helpers/availableCurrencies";
import { setPostValues } from "@/redux/reducers/postValuesSlice";
import { useRouter } from "next/router";
import { setPubId } from "@/redux/reducers/pubIdSlice";
import { setNFTImageArray } from "@/redux/reducers/NFTImageArraySlice";
import { setContractValues } from "@/redux/reducers/contractValuesSlice";

const usePost = () => {
  const router = useRouter();
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [postArgs, setPostArgs] = useState<any>();
  const [postDescription, setPostDescription] = useState<string>("");
  const [caretCoord, setCaretCoord] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [gifOpen, setGifOpen] = useState<boolean>(false);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const textElement = useRef<HTMLTextAreaElement>(null);
  const preElement = useRef<HTMLPreElement>(null);
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [title, setTitle] = useState<string>();
  const [sustained, setSustained] = useState<string>();
  const [involved, setInvolved] = useState<string>();
  const [filledInAmount, setFilledInAmount] = useState<number>(0);
  const [nextStore, setNextStore] = useState<number>(0);
  const [nextURI, setNextURI] = useState<number>(0);
  const [recipients, setRecipients] = useState<
    { recipient: string; split: number }[]
  >([
    {
      recipient: "",
      split: 0,
    },
    {
      recipient: "",
      split: 0,
    },
    {
      recipient: "",
      split: 0,
    },
  ]);
  const [results, setResults] = useState<any>([]);
  const [gifs, setGifs] = useState<UploadedMedia[]>([]);
  const [searchGif, setSearchGif] = useState<string>("");
  const [postHTML, setPostHTML] = useState<string>("");
  const [contentURI, setContentURI] = useState<string>();
  const [editionAmount, setEditionAmount] = useState<number>(100);
  const [enabledCurrencies, setEnabledCurrencies] = useState<Erc20[]>([]);
  const [referralFee, setReferralFee] = useState<number>(0);
  const [valueAmount, setValueAmount] = useState<number>(1);
  const [currency, setCurrency] = useState<string>();
  const { signTypedDataAsync } = useSignTypedData();
  const dispatch = useDispatch();
  const { uploadImage } = useImageUpload();
  const profileId = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const pubId = useSelector((state: RootState) => state.app.pubIdReducer.pubId);
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const postImages = useSelector(
    (state: RootState) => state?.app?.publicationImageReducer?.value
  );

  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "postWithSig",
    enabled: Boolean(postArgs),
    args: [postArgs],
  });

  const { writeAsync } = useContractWrite(config);

  const handleGif = (e: FormEvent): void => {
    setSearchGif((e.target as HTMLFormElement).value);
  };

  const handleGifSubmit = async (): Promise<void> => {
    const getGifs = await fetch("/api/giphy", {
      method: "POST",
      body: JSON.stringify(searchGif),
    });
    const allGifs = await getGifs.json();
    setResults(allGifs?.json?.results);
  };

  const handleSetGif = (result: any): void => {
    if ((postImages as any)?.length < 4) {
      setGifs([
        ...(postImages as any),
        {
          cid: result,
          type: MediaType.Gif,
        },
      ]);
    }
  };

  const handleKeyDownDelete = (e: KeyboardEvent<Element>) => {
    const highlightedContent = document.querySelector("#highlighted-content")!;
    const selection = window.getSelection();
    if (e.key === "Backspace" && selection?.toString() !== "") {
      const start = textElement.current!.selectionStart;
      const end = textElement.current!.selectionEnd;

      if (start === 0 && end === textElement.current!.value?.length) {
        setPostDescription("");
        setPostHTML("");
        // highlightedContent.innerHTML = "";
      } else {
        const selectedText = selection!.toString();
        const selectedHtml = highlightedContent.innerHTML.substring(start, end);
        const strippedHtml = selectedHtml?.replace(
          /( style="[^"]*")|( style='[^']*')/g,
          ""
        );
        const strippedText = selectedText?.replace(/<[^>]*>/g, "");

        const newHTML =
          postHTML.slice(0, start) + strippedHtml + postHTML.slice(end);
        const newDescription =
          postDescription.slice(0, start) +
          strippedText +
          postDescription.slice(end);

        setPostHTML(newHTML);
        setPostDescription(newDescription);
        (e.currentTarget! as any).value = newDescription;
        // highlightedContent.innerHTML = newHTML;
      }
    } else if (
      e.key === "Backspace" &&
      postDescription?.length === 0 &&
      postHTML?.length === 0
    ) {
      (e.currentTarget! as any).value = "";
      // highlightedContent.innerHTML = "";
      e.preventDefault();
    }
  };

  const handlePostDescription = async (e: any): Promise<void> => {
    let resultElement = document.querySelector("#highlighted-content");
    const newValue = e.target.value.endsWith("\n")
      ? e.target.value + " "
      : e.target.value;
    setPostHTML(getPostHTML(e, resultElement as Element));
    setPostDescription(newValue);
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
        "@" &&
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1]
        ?.length === 1
    ) {
      setCaretCoord(getCaretPos(e, textElement));
      setProfilesOpen(true);
    }
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
      "@"
    ) {
      const allProfiles = await searchProfile({
        query: e.target.value.split(" ")[e.target.value.split(" ")?.length - 1],
        type: "PROFILE",
        limit: 50,
      });
      setMentionProfiles(allProfiles?.data?.search?.items);
    } else {
      setProfilesOpen(false);
      setMentionProfiles([]);
    }
  };

  const clearPost = () => {
    setPostLoading(false);
    setPostDescription("");
    setPostHTML("");
    setGifs([]);
    dispatch(setPublicationImages([]));
    setGifOpen(false);
    // (document as any).querySelector("#highlighted-content").innerHTML = "";
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
  };

  const postGrant = async (): Promise<void> => {
    if (
      (!postDescription ||
        postDescription === "" ||
        postDescription.trim()?.length < 0) &&
      (!postImages?.length || postImages?.length < 1)
    ) {
      return;
    }
    setPostLoading(true);
    let result: any;
    try {
      const contentURIValue = await uploadPostContent(
        postImages,
        postDescription,
        setContentURI,
        contentURI,
        dispatch,
        title as string,
        sustained as string,
        involved as string
      );

      if (dispatcher) {
        result = await createDispatcherPostData({
          profileId: profileId?.id,
          contentURI: "ipfs://" + contentURIValue,
          collectModule: {
            multirecipientFeeCollectModule: {
              amount: {
                currency: currency,
                value: valueAmount,
              },
              collectLimit: String(editionAmount),
              recipients: recipients,
              referralFee: referralFee,
              followerOnly: false,
            },
          },
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });
        clearPost();
        setTimeout(async () => {
          await handleIndexCheck(
            result?.data?.createPostViaDispatcher?.txHash,
            dispatch,
            true
          );
        }, 7000);
      } else {
        result = await createPostTypedData({
          profileId: profileId?.id,
          contentURI: "ipfs://" + contentURIValue,
          collectModule: {
            multirecipientFeeCollectModule: {
              amount: {
                currency: currency,
                value: valueAmount,
              },
              collectLimit: String(editionAmount),
              recipients: recipients,
              referralFee: referralFee,
              followerOnly: false,
            },
          },
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });

        const typedData: any = result.data.createPostTypedData.typedData;

        const signature = await signTypedDataAsync({
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]),
          value: omit(typedData?.value, ["__typename"]),
        } as any);

        const broadcastResult: any = await broadcast({
          id: result?.data?.createPostTypedData?.id,
          signature,
        });

        if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
          const { v, r, s } = splitSignature(signature);

          const postArgs = {
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            profileIdPointed: typedData.value.profileIdPointed,
            pubIdPointed: typedData.value.pubIdPointed,
            referenceModuleData: typedData.value.referenceModuleData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          setPostArgs(postArgs);
        } else {
          clearPost();
          setTimeout(async () => {
            await handleIndexCheck(
              broadcastResult?.data?.broadcast?.txHash,
              dispatch,
              true
            );
          }, 7000);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  const handlePostWrite = async (): Promise<void> => {
    setPostLoading(true);
    try {
      const tx = await writeAsync?.();
      clearPost();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await handleIndexCheck(res?.transactionHash, dispatch, true);
      if (res.status === "success") {
        router.push(`/grant/${pubId}`);
        dispatch(setPubId(undefined));
        dispatch(
          setPostValues({
            title: undefined,
            editionAmount: 100,
            description: undefined,
            sustained: undefined,
            involved: undefined,
            price: 1,
            referralFee: 0,
            currency: "",
            recipients: [],
          })
        );
        dispatch(setNFTImageArray([]));
        dispatch(setContractValues([]));
      }
    } catch (err) {
      console.error(err);
      setPostLoading(false);
    }
  };

  const handleMentionClick = (user: any) => {
    setProfilesOpen(false);
    let resultElement = document.querySelector("#highlighted-content");
    const newHTMLPost =
      postHTML?.substring(0, postHTML.lastIndexOf("@")) +
      `@${user?.handle}</span>`;
    const newElementPost =
      postDescription?.substring(0, postDescription.lastIndexOf("@")) +
      `@${user?.handle}`;
    setPostDescription(newElementPost);

    // if (newHTMLPost) (resultElement as any).innerHTML = newHTMLPost;
    setPostHTML(newHTMLPost);
  };

  const handleImagePaste = async (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        e.stopPropagation();
        const file = items[i].getAsFile();
        await uploadImage(file as File, true);
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handlePostWrite();
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(setPublicationImages(gifs));
  }, [gifs]);

  useEffect(() => {
    if (searchGif === "" || searchGif === " ") {
      setResults([]);
    }
  }, [searchGif]);

  useEffect(() => {
    if (document.querySelector("#highlighted-content")) {
      document.querySelector("#highlighted-content")!.innerHTML =
        postHTML.length === 0 ? "" : postHTML;
    }
  }, [postHTML, gifOpen]);

  useMemo(() => {
    try {
      availableCurrencies(setEnabledCurrencies, setCurrency);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    dispatch(
      setPostValues({
        title,
        editionAmount,
        description: postDescription,
        sustained,
        involved,
        price: valueAmount,
        referralFee,
        currency,
        recipients,
      })
    );
  }, [
    title,
    editionAmount,
    postDescription,
    sustained,
    involved,
    referralFee,
    currency,
    recipients,
  ]);

  const isFilled = (str: string | undefined) =>
    typeof str === "string" && str?.trim() !== "";

  useEffect(() => {
    let filledCounter: number = 0;

    if (isFilled(title)) filledCounter++;
    if (isFilled(sustained)) filledCounter++;
    if (isFilled(involved)) filledCounter++;
    if (isFilled(postDescription)) filledCounter++;
    if (
      recipients &&
      recipients.length > 0 &&
      recipients[0].recipient?.trim() !== "" &&
      recipients[0].split !== 0 &&
      typeof recipients[0].split !== undefined
    )
      filledCounter++;

    setFilledInAmount(filledCounter);
  }, [title, sustained, involved, postDescription, recipients]);

  return {
    postDescription,
    textElement,
    handlePostDescription,
    postLoading,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleGifSubmit,
    handleGif,
    results,
    gifs,
    handleSetGif,
    handleKeyDownDelete,
    gifOpen,
    setGifOpen,
    postGrant,
    preElement,
    handleImagePaste,
    setTitle,
    title,
    recipients,
    setRecipients,
    editionAmount,
    setEditionAmount,
    currency,
    setCurrency,
    valueAmount,
    setValueAmount,
    setReferralFee,
    referralFee,
    enabledCurrencies,
    sustained,
    setSustained,
    involved,
    setInvolved,
    filledInAmount,
    nextStore,
    setNextStore,
    nextURI,
    setNextURI,
  };
};

export default usePost;
