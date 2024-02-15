import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import MakeComment from "@/components/Common/modules/MakeComment";
import { WhoSwitchProps } from "../types/grant.types";
import Publication from "@/components/Common/modules/Publication";

const WhoSwitch: FunctionComponent<WhoSwitchProps> = ({
  interactionState,
  setMirrorChoiceOpen,
  mirror,
  mirrorChoiceOpen,
  like,
  bookmark,
  dispatch,
  who,
  interactionsLoading,
  router,
  info,
  handleMoreWho,
  whoLoading,
  setCommentBoxOpen,
  commentBoxOpen,
  lensConnected,
  caretCoordMain,
  setCaretCoordMain,
  setMakeCommentMain,
  setMentionProfilesMain,
  profilesOpenMain,
  makeCommentMain,
  mentionProfilesMain,
  setProfilesOpenMain,
  caretCoord,
  setCaretCoord,
  setMakeComment,
  setMentionProfiles,
  profilesOpen,
  makeComment,
  mentionProfiles,
  setProfilesOpen,
  comment,
  mainInteractionsLoading,
  postCollectGif,
  id,
  setMainContentLoading,
  mainContentLoading,
  setContentLoading,
  contentLoading,
}): JSX.Element => {
  return (
    <div className="relative gap-4 w-full h-fit flex flex-col items-center justify-start">
      {interactionState == "comments" && !whoLoading && (
        <MakeComment
          index={0}
          main
          comment={comment}
          caretCoord={caretCoordMain}
          setCaretCoord={setCaretCoordMain}
          setMakePostComment={setMakeCommentMain}
          setMentionProfiles={setMentionProfilesMain}
          profilesOpen={profilesOpenMain?.[0]}
          lensConnected={lensConnected}
          makePostComment={makeCommentMain?.[0]}
          mentionProfiles={mentionProfilesMain}
          setProfilesOpen={setProfilesOpenMain}
          setContentLoading={setMainContentLoading}
          contentLoading={mainContentLoading?.[0]}
          postCollectGif={postCollectGif}
          dispatch={dispatch}
          commentLoading={mainInteractionsLoading?.[0]?.comment}
          id={id}
        />
      )}
      {whoLoading ? (
        Array.from({ length: 20 })?.map((_, index: number) => {
          return (
            <div
              className="relative h-[20rem] w-full border border-black flex flex-col items-center justify-start bg-black animate-pulse"
              key={index}
            >
              <Bar title={"Loading..."} />
              <div className="relative w-full h-full flex flex-col bg-grant bg-repeat bg-contain"></div>
            </div>
          );
        })
      ) : (
        <InfiniteScroll
          loader={<></>}
          next={handleMoreWho}
          hasMore={info?.hasMore}
          dataLength={who?.length}
          className="relative w-full h-fit flex flex-col gap-4"
        >
          {who?.map((item, index: number) => {
            const pfp = createProfilePicture(
              (interactionState == "reacts"
                ? item?.profile
                : interactionState == "mirrors" ||
                  interactionState == "comments"
                ? item?.by
                : item
              )?.metadata?.picture
            );
            return (
              <div
                className="relative h-fit w-full border border-black flex flex-col items-center justify-start bg-black"
                key={index}
              >
                <Bar title={interactionState?.split("s")?.[0]} />
                <div className="relative w-full h-full flex flex-col bg-grant bg-cover gap-4 p-2">
                  {(interactionState == "comments" &&
                    item.__typename == "Comment") ||
                  (interactionState == "mirrors" &&
                    item.__typename == "Quote") ? (
                    <Publication
                      dispatch={dispatch}
                      index={index}
                      like={like}
                      comment={comment}
                      bookmark={bookmark}
                      item={item}
                      router={router}
                      caretCoord={caretCoord}
                      setCaretCoord={setCaretCoord}
                      setMakeComment={setMakeComment}
                      setMentionProfiles={setMentionProfiles}
                      profilesOpen={profilesOpen}
                      lensConnected={lensConnected}
                      makeComment={makeComment}
                      mentionProfiles={mentionProfiles}
                      setProfilesOpen={setProfilesOpen}
                      setContentLoading={setContentLoading}
                      contentLoading={contentLoading}
                      postCollectGif={postCollectGif}
                      interactionsLoading={interactionsLoading}
                      setMirrorChoiceOpen={setMirrorChoiceOpen}
                      mirrorChoiceOpen={mirrorChoiceOpen}
                      mirror={mirror}
                      setCommentBoxOpen={setCommentBoxOpen}
                      commentBoxOpen={commentBoxOpen}
                    />
                  ) : (
                    <div className="relative w-full h-20 flex flex-row items-center rounded-sm border border-white justify-start gap-3 text-xxs font-dog bg-black text-white p-2">
                      {pfp && (
                        <div
                          className="relative w-10 h-10 rounded-full flex items-center justify-center border border-white cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/grantee/${
                                (interactionState == "reacts"
                                  ? item?.profile
                                  : interactionState == "mirrors"
                                  ? item?.by
                                  : item
                                )?.handle?.suggestedFormatted?.localName?.split(
                                  "@"
                                )?.[1]
                              }`
                            )
                          }
                        >
                          <Image
                            src={pfp}
                            draggable={false}
                            objectFit="cover"
                            layout="fill"
                            className="rounded-full"
                          />
                        </div>
                      )}
                      <div className="relative w-fit h-fit flex items-centers justify-center">
                        {(interactionState == "reacts"
                          ? item?.profile
                          : interactionState == "mirrors"
                          ? item?.by
                          : item
                        )?.handle?.suggestedFormatted?.localName?.length > 20
                          ? (interactionState == "reacts"
                              ? item?.profile
                              : interactionState == "mirrors"
                              ? item?.by
                              : item
                            )?.handle?.suggestedFormatted?.localName?.slice(
                              0,
                              16
                            ) + "..."
                          : (interactionState == "reacts"
                              ? item?.profile
                              : interactionState == "mirrors"
                              ? item?.by
                              : item
                            )?.handle?.suggestedFormatted?.localName}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default WhoSwitch;
