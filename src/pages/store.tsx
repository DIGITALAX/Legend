import useStore from "@/components/Store/hooks/useStore";
import Filter from "@/components/Common/modules/Filter";
import Item from "@/components/Store/modules/StoreItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useInteractions from "@/components/Grants/hooks/useInteractions";
import { PrintItem } from "@/components/Launch/types/launch.types";
import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import { useAccount } from "wagmi";
import { NextRouter } from "next/router";
import Bar from "@/components/Common/modules/Bar";

export default function Store({ router }: { router: NextRouter }) {
  const dispatch = useDispatch();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI}`
    ),
  });
  const { address } = useAccount();
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const {
    searchFilters,
    setSearchFilters,
    collections,
    handleMoreCollections,
    info,
    collectionsLoading,
    setCollections,
    setCaretCoord,
    setMentionProfiles,
    setProfilesOpen,
    profilesOpen,
    inputElement,
    mentionProfiles,
    handleMoreFilteredCollections,
  } = useStore(lensConnected);
  const {
    like,
    bookmark,
    mirror,
    setMirrorChoiceOpen,
    mirrorChoiceOpen,
    interactionsLoading,
  } = useInteractions(
    lensConnected,
    dispatch,
    address,
    publicClient,
    router,
    collections as any[],
    (newItems) => setCollections(newItems as any)
  );

  return (
    <div className="relative w-full h-fit flex flex-row items-start justify-center p-5 gap-10">
      <Filter
        router={router}
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
        lensConnected={lensConnected}
        setCaretCoord={setCaretCoord}
        setMentionProfiles={setMentionProfiles}
        setProfilesOpen={setProfilesOpen}
        profilesOpen={profilesOpen}
        inputElement={inputElement}
        mentionProfiles={mentionProfiles}
      />
      <div
        className="relative w-full h-full flex items-start justify-start overflow-y-scroll"
        id="side"
      >
        <InfiniteScroll
          dataLength={collections?.length}
          loader={<></>}
          hasMore={info?.hasMore}
          next={
            searchFilters?.printType?.length > 0 ||
            searchFilters?.designer?.trim() !== "" ||
            searchFilters?.grant?.trim() !== ""
              ? handleMoreFilteredCollections
              : handleMoreCollections
          }
          className={`w-full h-fit grid grid-cols-3 gap-4`}
        >
          {collectionsLoading
            ? Array.from({ length: 10 })?.map((_, index: number) => {
                return (
                  <div
                    className="relative h-80 w-full w-full border border-black flex flex-col items-center justify-start bg-black animate-pulse"
                    key={index}
                  >
                    <Bar title={"Loading..."} />
                    <div className="relative w-full h-full flex flex-col bg-grant bg-repeat bg-contain"></div>
                  </div>
                );
              })
            : collections
                ?.sort((a, b) =>
                  searchFilters?.timestamp == "latest"
                    ? Number(a.blockTimestamp) - Number(b.blockTimestamp)
                    : Number(b.blockTimestamp) - Number(a.blockTimestamp)
                )
                ?.map((item: PrintItem, index: number) => {
                  return (
                    <Item
                      key={index}
                      collection={item}
                      index={index}
                      like={like}
                      bookmark={bookmark}
                      mirror={mirror}
                      dispatch={dispatch}
                      router={router}
                      mirrorChoiceOpen={mirrorChoiceOpen?.[index]}
                      setMirrorChoiceOpen={setMirrorChoiceOpen}
                      interactionsLoading={interactionsLoading?.[index]}
                    />
                  );
                })}
        </InfiniteScroll>
      </div>
    </div>
  );
}
