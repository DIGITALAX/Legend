import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Error from "./modules/Error";
import MediaExpand from "./modules/MediaExpand";
import ClaimProfile from "./modules/ClaimProfile";
import Index from "./modules/Index";
import PostCollectGif from "./modules/PostCollectGif";
import useCollectGif from "./hooks/useCollectGif";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import QuoteBox from "./modules/QuoteBox";
import { NextRouter } from "next/router";
import useInteractions from "../Grants/hooks/useInteractions";
import NotGrantee from "./modules/NotGrantee";
import GrantCollected from "./modules/GrantCollected";
import MilestoneClaim from "./modules/MilestoneClaim";

const Modals: FunctionComponent<{
  router: NextRouter;
}> = ({ router }): JSX.Element => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const errorModal = useSelector(
    (state: RootState) => state.app.errorModalReducer
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const availableCurrencies = useSelector(
    (state: RootState) => state.app.availableCurrenciesReducer.currencies
  );
  const imageExpandModal = useSelector(
    (state: RootState) => state.app.imageExpandReducer
  );
  const postBox = useSelector((state: RootState) => state.app.postReducer);
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensProfileReducer?.profile
  );
  const milestoneClaim = useSelector(
    (state: RootState) => state.app.milestoneClaimReducer
  );
  const grantCollected = useSelector(
    (state: RootState) => state.app.grantCollectedReducer
  );
  const claimProfile = useSelector(
    (state: RootState) => state.app.claimProfileReducer
  );
  const grantee = useSelector(
    (state: RootState) => state.app.granteeModalReducer
  );
  const indexer = useSelector((state: RootState) => state.app.indexerReducer);
  const { openMeasure, setOpenMeasure, handleGif, searchGifLoading } =
    useCollectGif(
      availableCurrencies,
      lensConnected,
      postCollectGif,
      postBox,
      dispatch,
      publicClient,
      address
    );
  const {
    setMainCaretCoord,
    mainCaretCoord,
    mainInteractionsLoading,
    mainContentLoading,
    setMainContentLoading,
    mainMakeComment,
    setMainMakeComment,
    mainProfilesOpen,
    setMainMentionProfiles,
    setMainProfilesOpen,
    mainMentionProfiles,
    quote,
  } = useInteractions(
    lensConnected,
    dispatch,
    address,
    publicClient,
    router,
    [],
    () => {},
    undefined,
    undefined,
    postCollectGif,
    undefined,
    postBox?.quote?.id
  );
  return (
    <>
      {errorModal.value && (
        <Error message={errorModal.message} dispatch={dispatch} />
      )}
      {grantee?.value && <NotGrantee dispatch={dispatch} />}
      {postBox.value && (
        <QuoteBox
          quote={postBox.quote!}
          dispatch={dispatch}
          postCollectGif={postCollectGif}
          router={router}
          lensConnected={lensConnected}
          caretCoord={mainCaretCoord}
          profilesOpen={mainProfilesOpen}
          mentionProfiles={mainMentionProfiles}
          setMentionProfiles={setMainMentionProfiles}
          setProfilesOpen={setMainProfilesOpen}
          setCaretCoord={setMainCaretCoord}
          interactionsLoading={mainInteractionsLoading}
          contentLoading={mainContentLoading}
          setContentLoading={setMainContentLoading}
          setMakeComment={setMainMakeComment}
          makeComment={mainMakeComment}
          comment={quote}
        />
      )}
      {postCollectGif?.type && (
        <PostCollectGif
          dispatch={dispatch}
          openMeasure={openMeasure}
          setOpenMeasure={setOpenMeasure}
          availableCurrencies={availableCurrencies}
          type={postCollectGif?.type}
          id={postCollectGif?.id!}
          collectTypes={postCollectGif?.collectTypes}
          handleGif={handleGif}
          gifs={postCollectGif?.gifs}
          searchGifLoading={searchGifLoading}
        />
      )}
      {imageExpandModal.value && (
        <MediaExpand
          type={imageExpandModal.type}
          image={imageExpandModal.media}
          dispatch={dispatch}
        />
      )}
      {milestoneClaim?.open && (
        <MilestoneClaim
          dispatch={dispatch}
          milestone={milestoneClaim?.milestone!}
          cover={milestoneClaim?.cover!}
        />
      )}
      {grantCollected?.value && (
        <GrantCollected dispatch={dispatch} details={grantCollected?.item!} />
      )}
      {claimProfile?.value && <ClaimProfile dispatch={dispatch} />}
      {indexer?.open && <Index message={indexer?.message!} />}
    </>
  );
};

export default Modals;
