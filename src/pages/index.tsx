import useGrants from "@/components/Grants/hooks/useGrants";
import Grant from "@/components/Grants/modules/Grant";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRouter } from "next/router";
import { Grant as GrantType } from "@/components/Grants/types/grant.types";
import useInteractions from "@/components/Grants/hooks/useInteractions";
import { useAccount } from "wagmi";
import { polygonMumbai } from "viem/chains";
import { createPublicClient, http } from "viem";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
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
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensProfileReducer?.profile
  );
  const allGrants = useSelector(
    (state: RootState) => state.app.allGrantsReducer.levels
  );
  const { handleFetchMoreGrants, allGrantsLoading, grantInfo } = useGrants(
    dispatch,
    allGrants,
    collectionsCache,
    lensConnected
  );

  const {
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
  } = useInteractions(
    lensConnected,
    dispatch,
    address,
    publicClient,
    allGrants
  );

  console.log({ allGrants });

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-start p-2 overflow-auto flex-grow"
      id="milestone"
    >
      <div className="relative w-full h-fit overflow-y-scroll flex items-start justify-center">
        {allGrantsLoading ? (
          <div className="w-full h-full items-start justify-center gap-8 flex flex-col">
            {Array.from({ length: 10 }).map((_, index) => {
              return (
                <div
                  key={index}
                  className="relative h-fit w-[30rem] border border-black flex flex-col items-center justify-center"
                >
                  <div
                    className="relative w-full h-fit flex flex-col"
                    id="grant"
                  ></div>
                </div>
              );
            })}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={allGrants?.length}
            loader={<></>}
            hasMore={grantInfo?.hasMore}
            next={handleFetchMoreGrants}
            className={`w-full h-full items-start justify-center gap-8 flex flex-col`}
          >
            {allGrants?.map((grant: GrantType, index: number) => {
              return (
                <Grant
                  key={index}
                  grant={grant}
                  index={index}
                  interactionsLoading={interactionsLoading}
                  mirror={mirror}
                  like={like}
                  bookmark={bookmark}
                  setMirrorChoiceOpen={setMirrorChoiceOpen}
                  mirrorChoiceOpen={mirrorChoiceOpen}
                  dispatch={dispatch}
                  router={router}
                  followProfile={followProfile}
                  unfollowProfile={unfollowProfile}
                />
              );
            })}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
