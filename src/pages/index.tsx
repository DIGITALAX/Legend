import useGrants from "@/components/Grants/hooks/useGrants";
import Grant from "@/components/Grants/modules/Grant";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { NextRouter } from "next/router";
import { Grant as GrantType } from "@/components/Grants/types/grant.types";
import useInteractions from "@/components/Grants/hooks/useInteractions";
import { useAccount } from "wagmi";
import { polygonMumbai } from "viem/chains";
import { createPublicClient, http } from "viem";
import useLevelItems from "@/components/Launch/hooks/useLevelItems";
import Bar from "@/components/Common/modules/Bar";
import useCheckout from "@/components/Checkout/hooks/useCheckout";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { setAllGrants } from "../../redux/reducers/allGrantsSlice";

export default function Home({
  client,
  router,
}: {
  client: LitNodeClient;
  router: NextRouter;
}) {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI}`
    ),
  });
  const collectionsCache = useSelector(
    (state: RootState) => state.app.collectionsCacheReducer.value
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer?.items
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensProfileReducer?.profile
  );
  const allGrants = useSelector(
    (state: RootState) => state.app.allGrantsReducer.levels
  );
  const { setDetails, details } = useLevelItems(
    dispatch,
    undefined,
    undefined,
    allGrants,
    router
  );
  const {
    handleCheckout,
    simpleCheckoutLoading,
    approvePurchase,
    spendApproved,
  } = useCheckout(
    cartItems,
    client,
    address,
    allGrants,
    dispatch,
    publicClient,
    lensConnected,
    oracleData,
    details,
    router
  );
  const {
    handleFetchMoreGrants,
    allGrantsLoading,
    grantInfo,
    changeCurrency,
    setChangeCurrency,
    showFundedHover,
    setShowFundedHover,
  } = useGrants(
    dispatch,
    allGrants,
    collectionsCache,
    lensConnected,
    oracleData
  );
  const {
    mirror,
    like,
    bookmark,
    interactionsLoading,
    mirrorChoiceOpen,
    setMirrorChoiceOpen,
  } = useInteractions(
    lensConnected,
    dispatch,
    address,
    publicClient,
    router,
    allGrants,
    (newItems) => dispatch(setAllGrants(newItems as GrantType[]))
  );

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start px-2 pt-2 overflow-auto flex-grow">
      <div className="relative w-full h-fit overflow-y-scroll flex items-start justify-center">
        <InfiniteScroll
          dataLength={allGrants?.length}
          loader={<></>}
          hasMore={grantInfo?.hasMore}
          next={handleFetchMoreGrants}
          className={`w-full h-full items-start justify-center flex`}
        >
          <div className="relative w-full h-fit flex flex-col items-center justify-start gap-8">
            {allGrantsLoading
              ? Array.from({ length: 10 })?.map((_, index: number) => {
                  return (
                    <div
                      className="relative h-[20rem] w-full sm:w-3/4 xl:w-1/2 border border-black flex flex-col items-center justify-start bg-black animate-pulse"
                      key={index}
                    >
                      <Bar title={"Loading..."} />
                      <div className="relative w-full h-full flex flex-col bg-grant bg-repeat bg-contain"></div>
                    </div>
                  );
                })
              : allGrants?.map((grant: GrantType, index: number) => {
                  return (
                    <Grant
                      setShowFundedHover={setShowFundedHover}
                      showFundedHover={showFundedHover?.[index]}
                      key={index}
                      oracleData={oracleData}
                      grant={grant}
                      spendApproved={spendApproved?.[index]}
                      approvePurchase={approvePurchase}
                      simpleCollectLoading={simpleCheckoutLoading?.[index]}
                      mainIndex={index}
                      cartItems={cartItems}
                      interactionsLoading={interactionsLoading?.[index]}
                      mirror={mirror}
                      like={like}
                      handleCheckout={handleCheckout}
                      bookmark={bookmark}
                      setMirrorChoiceOpen={setMirrorChoiceOpen}
                      mirrorChoiceOpen={mirrorChoiceOpen}
                      dispatch={dispatch}
                      router={router}
                      details={details?.[index]}
                      setDetails={setDetails}
                      changeCurrency={changeCurrency?.[index]}
                      setChangeCurrency={setChangeCurrency}
                    />
                  );
                })}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
