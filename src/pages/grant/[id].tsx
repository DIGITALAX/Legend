import useGrant from "@/components/Grant/hooks/useGrant";
import { NextRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import RouterChange from "@/components/Common/modules/RouterChange";
import useLevelItems from "@/components/Launch/hooks/useLevelItems";
import Bar from "@/components/Common/modules/Bar";
import Interactions from "@/components/Grants/modules/Interactions";
import LevelOne from "@/components/Launch/modules/LevelOne";
import CollectItem from "@/components/Common/modules/CollectItem";
import { LevelInfo } from "@/components/Launch/types/launch.types";
import useCheckout from "@/components/Checkout/hooks/useCheckout";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import useInteractions from "@/components/Grants/hooks/useInteractions";
import moment from "moment";
import { ImageMetadataV3, Post, Profile } from "../../../graphql/generated";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../lib/constants";
import createProfilePicture from "../../../lib/lens/helpers/createProfilePicture";
import Milestone from "@/components/Grants/modules/Milestone";
import { Milestone as MilestoneType } from "@/components/Grants/types/grant.types";
import useWho from "@/components/Grant/hooks/useWho";
import WhoSwitch from "@/components/Grant/modules/WhoSwitch";

export default function Grant({
  router,
  litNodeClient,
}: {
  router: NextRouter;
  litNodeClient: LitNodeClient;
}) {
  const { id } = router.query;
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI}`
    ),
  });
  const dispatch = useDispatch();
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const collectionsCache = useSelector(
    (state: RootState) => state.app.collectionsCacheReducer.value
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const {
    grant,
    grantLoading,
    setGrant,
    setShowFundedHover,
    showFundedHover,
    changeCurrency,
    setChangeCurrency,
  } = useGrant(id as string, lensConnected, collectionsCache, oracleData);
  const { details, setDetails } = useLevelItems(
    dispatch,
    undefined,
    undefined,
    undefined,
    undefined,
    grant
  );
  const {
    handleCheckout,
    approvePurchase,
    spendApproved,
    simpleCheckoutLoading,
  } = useCheckout(
    cartItems,
    litNodeClient,
    address,
    dispatch,
    publicClient,
    lensConnected,
    oracleData,
    router,
    [grant!],
    details
  );
  const {
    setInteractionState,
    interactionState,
    who,
    setWho,
    handleMoreWho,
    info,
    whoLoading,
    handleComments,
  } = useWho(id as string, lensConnected);
  const {
    mirror,
    like,
    bookmark,
    mainInteractionsLoading,
    interactionsLoading,
    mirrorChoiceOpen,
    setMirrorChoiceOpen,
    setMainMirrorChoiceOpen,
    mainMirrorChoiceOpen,
    setCommentBoxOpen,
    commentBoxOpen,
    mainCaretCoord,
    mainMakeComment,
    setCaretCoord,
    setMainMakeComment,
    setMainCaretCoord,
    setMainMentionProfiles,
    setMakeComment,
    setMentionProfiles,
    mainMentionProfiles,
    makeComment,
    mentionProfiles,
    caretCoord,
    profilesOpen,
    mainProfilesOpen,
    setMainProfilesOpen,
    setProfilesOpen,
    comment,
    mainContentLoading,
    setMainContentLoading,
    setContentLoading,
    contentLoading,
  } = useInteractions(
    lensConnected,
    dispatch,
    address,
    publicClient,
    router,
    who as Post[],
    (newItems) => setWho(newItems as Post[]),
    [grant!],
    handleComments,
    postCollectGif,
    setGrant
  );

  if (!grantLoading && grant) {
    return (
      <div
        className="relative w-full h-fit overflow-y-scroll flex items-start justify-center pt-5 px-5"
        id="side"
      >
        <div className="relative w-5/6 flex-col gap-10 flex items-center justify-start h-fit">
          <div className="relative w-full h-[47rem] flex items-start justify-between flex-row gap-10">
            <div className="relative w-full h-full flex flex-col gap-3 justify-center items-center ml-0">
              <div
                className="relative w-full h-fit max-h-[13rem] flex items-start justify-center rounded-sm bg-offBlack border border-lima pb-3 px-1.5"
                id="side"
              >
                <div className="relative overflow-y-scroll w-full h-fit flex justify-start items-start flex-col ml-0 gap-2">
                  <div className="relative font-gam text-xl justify-start items-start flex text-white">
                    Grant Team
                  </div>
                  <div className="relative mr-0 w-fit h-fit items-center justify-end flex flex-wrap gap-2">
                    {grant?.grantees?.map((profile: Profile, index: number) => {
                      const pfp = createProfilePicture(
                        profile?.metadata?.picture
                      );
                      return (
                        <div
                          key={index}
                          className="relative w-8 h-8 rounded-full border border-lima bg-mar/70 cursor-pointer flex cursor-pointer active:scale-95"
                          title={profile?.handle?.suggestedFormatted?.localName}
                          onClick={() =>
                            router.push(
                              `/grantee/${
                                profile?.handle?.suggestedFormatted?.localName?.split(
                                  "@"
                                )?.[1]
                              }`
                            )
                          }
                        >
                          {pfp && (
                            <div className="relative w-full h-full rounded-full flex items-center justify-center">
                              <Image
                                src={pfp}
                                draggable={false}
                                objectFit="cover"
                                layout="fill"
                                className="rounded-full"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <Interactions
                like={like}
                router={router}
                index={0}
                interactionsLoading={mainInteractionsLoading?.[0]}
                post={grant?.publication!}
                bookmark={bookmark}
                mirror={mirror}
                dispatch={dispatch}
                mirrorChoiceOpen={mainMirrorChoiceOpen?.[0]}
                setMirrorChoiceOpen={setMainMirrorChoiceOpen}
                main
                setInteractionState={setInteractionState}
              />

              <div
                className="relative rounded-sm w-full h-full py-3 px-6 items-start justify-between flex bg-mar/75 border border-lima overflow-y-scroll"
                id="side"
              >
                <WhoSwitch
                  postCollectGif={postCollectGif}
                  id={id as string}
                  mainInteractionsLoading={mainInteractionsLoading}
                  mainContentLoading={mainContentLoading}
                  setMainContentLoading={setMainContentLoading}
                  setContentLoading={setContentLoading}
                  contentLoading={contentLoading}
                  info={info}
                  lensConnected={lensConnected}
                  setCommentBoxOpen={setCommentBoxOpen}
                  commentBoxOpen={commentBoxOpen}
                  handleMoreWho={handleMoreWho}
                  interactionState={interactionState}
                  interactionsLoading={interactionsLoading}
                  mirrorChoiceOpen={mirrorChoiceOpen}
                  setMirrorChoiceOpen={setMirrorChoiceOpen}
                  bookmark={bookmark}
                  mirror={mirror}
                  dispatch={dispatch}
                  like={like}
                  comment={comment}
                  router={router}
                  who={who}
                  whoLoading={whoLoading}
                  makeComment={makeComment}
                  makeCommentMain={mainMakeComment}
                  mentionProfiles={mentionProfiles}
                  mentionProfilesMain={mainMentionProfiles}
                  profilesOpen={profilesOpen}
                  profilesOpenMain={mainProfilesOpen}
                  caretCoord={caretCoord}
                  caretCoordMain={mainCaretCoord}
                  setCaretCoord={setCaretCoord}
                  setCaretCoordMain={setMainCaretCoord}
                  setMakeComment={setMakeComment}
                  setMakeCommentMain={setMainMakeComment}
                  setMentionProfiles={setMentionProfiles}
                  setMentionProfilesMain={setMainMentionProfiles}
                  setProfilesOpen={setProfilesOpen}
                  setProfilesOpenMain={setMainProfilesOpen}
                />
              </div>
            </div>
            <div className="relative w-full h-full flex flex-col items-start justify-start mr-0">
              <Bar
                title={
                  (grant?.publication?.metadata as ImageMetadataV3)?.title! +
                  " " +
                  `(${moment(grant?.publication?.createdAt).fromNow()})`
                }
              />
              <div className="relative overflow-y-scroll bg-offWhite w-full h-full flex flex-col items-center justify-start p-3 gap-6 border border-black rounded-b-sm">
                {[
                  {
                    title: "Overview",
                    description: grant?.grantMetadata?.description,
                  },
                  {
                    title: "Maintenance Strategy",
                    description: grant?.grantMetadata?.strategy,
                  },
                  {
                    title: "Tech Stack",
                    description: grant?.grantMetadata?.tech,
                  },
                  {
                    title: "Team Experience",
                    description: grant?.grantMetadata?.experience,
                  },
                  {
                    title: "Who's Involved",
                    description: grant?.grantMetadata?.team,
                  },
                ].map(
                  (
                    item: {
                      title: string;
                      description: string;
                    },
                    index: number
                  ) => {
                    return (
                      <div
                        key={index}
                        className="relative flex flex-col justify-start items-start w-full h-full font-dog text-black text-xs gap-2"
                      >
                        <div className="relative w-fit h-fit flex justify-start items-start">
                          {item.title}
                        </div>
                        <div className="relative w-full h-44">
                          <div className="w-full h-full border border-black p-2 rounded-sm overflow-y-scroll">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
          <div className="relative flex flex-col items-center justify-center w-full h-fit gap-2">
            <div className="relative px-2 py-1 text-center flex items-center justify-center bg-mar/70 border border-lima font-gam uppercase rounded-sm text-4xl text-lima w-full h-fit">
              Milestones
            </div>
            <div
              className="relative w-full h-110 overflow-y-scroll bg-offBlack border border-lima rounded-sm flex flex-col gap-16 p-4"
              id="milestone"
            >
              {grant?.milestones?.map(
                (milestone: MilestoneType, index: number) => {
                  return (
                    <Milestone
                      acceptedTokens={grant?.acceptedCurrencies}
                      key={index}
                      mainIndex={0}
                      metadata={grant?.grantMetadata?.milestones?.[index]}
                      milestone={milestone}
                      index={index}
                      changeCurrency={changeCurrency?.[0]}
                      setChangeCurrency={setChangeCurrency}
                    />
                  );
                }
              )}
            </div>
          </div>
          <div className="relative flex flex-col items-center justify-center w-full h-fit gap-2 pb-5">
            {grant?.totalFundedUSD > 0 && (
              <div
                className={`relative w-full h-8 bg-lima/75 border border-lima flex rounded-lg`}
              >
                <div
                  className={`relative h-full cursor-pointer ${
                    grant?.totalFundedUSD / grant?.totalGoalUSD >= 100
                      ? "rounded-lg"
                      : "rounded-l-lg"
                  } bg-mar/75 flex`}
                  style={{
                    width: `${grant?.totalFundedUSD / grant?.totalGoalUSD}%`,
                  }}
                  onMouseOver={() => setShowFundedHover(true)}
                  onMouseLeave={() => setShowFundedHover(false)}
                ></div>
                {showFundedHover && (
                  <div className="absolute flex items-center justify-center -top-6 right-auto bg-mar/80 border text-super px-1 py-1.5 border-lima text-white font-dog rounded-md z-10">
                    {`${(grant?.totalFundedUSD / grant?.totalGoalUSD).toFixed(
                      2
                    )}% Funded`}
                  </div>
                )}
              </div>
            )}
            <div className="relative px-2 py-1 text-center flex items-center justify-center bg-mar/70 border border-lima font-gam uppercase rounded-sm text-4xl text-lima w-full h-fit">
              collect grant
            </div>
            <div
              className="relative w-full h-fit  p-2 rounded-sm overflow-x-scroll bg-offBlack items-start justify-start flex flex-col border border-lima"
              id="milestone"
            >
              <div className="relative w-fit h-fit flex flex-row gap-4 pb-2 items-start justify-start">
                <LevelOne
                  details={details?.[0]?.[0]}
                  setDetails={setDetails}
                  mainIndex={0}
                  oracleData={oracleData}
                  cart
                  grant={grant}
                  handleCheckout={handleCheckout}
                  simpleCheckoutLoading={simpleCheckoutLoading?.[0]}
                  spendApproved={spendApproved?.[0]}
                  approvePurchase={approvePurchase}
                  acceptedTokens={grant?.acceptedCurrencies}
                />
                {grant?.levelInfo?.map((level: LevelInfo, index: number) => {
                  return (
                    <CollectItem
                      key={index}
                      dispatch={dispatch}
                      levelInfo={level}
                      grant={grant}
                      router={router}
                      cart
                      mainIndex={0}
                      setDetails={setDetails}
                      details={details?.[0]?.[level.level - 1]}
                      oracleData={oracleData}
                      cartItems={cartItems}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <RouterChange />;
}
