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

const Modals: FunctionComponent = (): JSX.Element => {
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
  const claimProfile = useSelector(
    (state: RootState) => state.app.claimProfileReducer
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
  return (
    <>
      {errorModal.value && (
        <Error message={errorModal.message} dispatch={dispatch} />
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
      {claimProfile?.value && <ClaimProfile dispatch={dispatch} />}
      {indexer?.open && <Index message={indexer?.message!} />}
    </>
  );
};

export default Modals;
