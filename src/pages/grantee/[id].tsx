import useGrantee from "@/components/Grantee/hooks/useGrantee";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NextRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import GrantItem from "@/components/Web3/modules/Item";
import { Grant } from "@/components/Grants/types/grant.types";
import Bar from "@/components/Common/modules/Bar";
import useInteractions from "@/components/Grants/hooks/useInteractions";
import useFollow from "@/components/Grantee/hooks/useFollow";
import Account from "@/components/Grantee/modules/Account";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import Orders from "@/components/Grantee/modules/Orders";
import Edit from "@/components/Grantee/modules/Edit";
import useClaim from "@/components/Grantee/hooks/useClaim";
import useOrders from "@/components/Grantee/hooks/useOrders";
import { LitNodeClient } from "@lit-protocol/lit-node-client";

export default function Grantee({
  router,
  client,
}: {
  router: NextRouter;
  client: LitNodeClient;
}) {
  const { id } = router.query;
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const dispatch = useDispatch();
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensProfileReducer?.profile
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer?.data
  );
  const {
    grantee,
    grants,
    granteeLoading,
    handleMoreGrants,
    info,
    showFundedHover,
    setShowFundedHover,
    setGrants,
    edit,
    setEdit,
    setOrders,
    orders,
  } = useGrantee(id as string, lensConnected, oracleData);
  const { followLoading, followProfile, unfollowProfile } = useFollow(
    grantee?.id,
    lensConnected,
    dispatch,
    address as `0x${string}`,
    publicClient
  );
  const {
    milestoneClaimLoading,
    handleClaimMilestone,
    showFundedHover: showFundedHoverEdit,
    setShowFundedHover: setShowFundedHoverEdit,
  } = useClaim(address, publicClient, edit, dispatch, setEdit, setGrants);
  const {
    allOrders,
    ordersLoading,
    orderOpen,
    setOrderOpen,
    decryptOrder,
    orderDecrypting,
  } = useOrders(address, lensConnected, client, orders);
  const {
    like,
    bookmark,
    mirror,
    mirrorChoiceOpen,
    setMirrorChoiceOpen,
    interactionsLoading,
  } = useInteractions(
    lensConnected,
    dispatch,
    address,
    publicClient,
    router,
    grants,
    (newItems) => setGrants(newItems as any[])
  );
  return (
    <div
      className="relative w-full h-full overflow-y-scroll flex items-start justify-center bg-black pt-5 px-2 lg:px-5 gap-10 flex-col"
      id="side"
    >
      <Account
        followLoading={followLoading}
        profile={grantee}
        followProfile={followProfile}
        unfollowProfile={unfollowProfile}
        granteeLoading={granteeLoading}
        owner={grantee?.ownedBy?.address == lensConnected?.ownedBy?.address}
        setOrders={setOrders}
        edit={edit}
        orders={orders}
        setEdit={setEdit}
      />
      {orders ? (
        <Orders
          allOrders={allOrders}
          ordersLoading={ordersLoading}
          orderOpen={orderOpen}
          setOrderOpen={setOrderOpen}
          decryptOrder={decryptOrder}
          orderDecrypting={orderDecrypting}
        />
      ) : !edit ? (
        <div
          className="relative w-full h-full flex items-start justify-start overflow-y-scroll"
          id="side"
        >
          <InfiniteScroll
            dataLength={grants?.length}
            loader={<></>}
            hasMore={info?.hasMore}
            next={handleMoreGrants}
            className={`w-full h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-4`}
          >
            {granteeLoading
              ? Array.from({ length: 10 })?.map((_, index: number) => {
                  return (
                    <div
                      className="relative h-80 w-full w-full border border-black flex flex-col items-center justify-start bg-offWhite animate-pulse"
                      key={index}
                    >
                      <Bar title={"Loading..."} />
                      <div className="relative w-full h-full flex flex-col bg-grant bg-repeat bg-contain"></div>
                    </div>
                  );
                })
              : grants?.map((item: Grant & { type: string }, index: number) => {
                  return (
                    <GrantItem
                      type={item?.type}
                      setEdit={setEdit}
                      setShowFundedHover={setShowFundedHover}
                      showFundedHover={showFundedHover?.[index]}
                      key={index}
                      grant={item}
                      index={index}
                      like={like}
                      owner={item?.grantees
                        ?.map((i) => i?.ownedBy?.address?.toLowerCase())
                        ?.includes(
                          lensConnected?.ownedBy?.address?.toLowerCase()
                        )}
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
      ) : (
        <Edit
          router={router}
          setShowFundedHover={setShowFundedHoverEdit}
          showFundedHover={showFundedHoverEdit}
          handleClaimMilestone={handleClaimMilestone}
          grant={edit}
          milestoneClaimLoading={milestoneClaimLoading}
        />
      )}
    </div>
  );
}
