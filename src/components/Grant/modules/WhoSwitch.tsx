import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Bar from "@/components/Common/modules/Bar";
import descriptionRegex from "../../../../lib/graph/helpers/descriptionRegex";
import {
  ImageMetadataV3,
  PublicationMetadataMedia,
} from "../../../../graphql/generated";
import Interactions from "../../Grants/modules/Interactions";
import Image from "next/legacy/image";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import MakeComment from "@/components/Common/modules/MakeComment";
import { WhoSwitchProps } from "../types/grant.types";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import { metadataMedia } from "../../../../lib/lens/helpers/postMetadata";
import { setMediaExpand } from "../../../../redux/reducers/mediaExpandSlice";

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
                    <>
                      <div className="relative w-full max-h-[28rem] flex items-start justify-start overflow-y-scroll">
                        <div className="relative w-full h-fit flex items-start justify-start flex-col gap-2">
                          {[
                            item?.metadata?.asset,
                            ...(item?.metadata?.attachments || []),
                          ].filter(Boolean)?.length > 0 &&
                            [
                              item?.metadata?.asset,
                              ...(item?.metadata?.attachments || []),
                            ]?.map(
                              (
                                img: PublicationMetadataMedia,
                                index: number
                              ) => {
                                const media = metadataMedia(img);
                                return (
                                  <div
                                    className="relative w-24 h-24 flex border border-mar rounded-sm cursor-pointer bg-offBlack"
                                    key={index}
                                    onClick={() =>
                                      dispatch(
                                        setMediaExpand({
                                          actionValue: true,
                                          actionType: "png",
                                          actionMedia: media?.url,
                                        })
                                      )
                                    }
                                  >
                                    {media?.url && (
                                      <MediaSwitch
                                        type={media?.type}
                                        srcUrl={media?.url}
                                        srcCover={media?.cover}
                                        classNameVideo={{
                                          objectFit: "cover",
                                          display: "flex",
                                          width: "100%",
                                          height: "100%",
                                          alignItems: "center",
                                          justifyItems: "center",
                                          borderRadius: "0.125rem",
                                          position: "absolute",
                                        }}
                                        classNameImage={"rounded-sm"}
                                        classNameAudio={"rounded-md"}
                                      />
                                    )}
                                  </div>
                                );
                              }
                            )}
                        </div>
                      </div>
                      <div
                        className="relative w-full h-[7rem] max-h-[15rem] bg-offBlack rounded-sm py-2 px-1.5 text-white overflow-y-scroll flex items-start justify-start break-words text-xxs whitespace-preline overflow-y-scroll font-dog"
                        dangerouslySetInnerHTML={{
                          __html: descriptionRegex(
                            (item?.metadata as ImageMetadataV3)?.content,
                            false
                          ),
                        }}
                      ></div>
                      <Interactions
                        like={like}
                        index={index}
                        interactionsLoading={interactionsLoading?.[index]}
                        setMirrorChoiceOpen={setMirrorChoiceOpen}
                        mirrorChoiceOpen={mirrorChoiceOpen?.[index]}
                        mirror={mirror}
                        dispatch={dispatch}
                        router={router}
                        bookmark={bookmark}
                        post={item}
                        setCommentBoxOpen={setCommentBoxOpen}
                      />
                      {commentBoxOpen?.[index] && (
                        <MakeComment
                          index={index}
                          caretCoord={caretCoord}
                          setCaretCoord={setCaretCoord}
                          setMakePostComment={setMakeComment}
                          setMentionProfiles={setMentionProfiles}
                          profilesOpen={profilesOpen?.[index]}
                          lensConnected={lensConnected}
                          makePostComment={makeComment?.[index]}
                          mentionProfiles={mentionProfiles}
                          setProfilesOpen={setProfilesOpen}
                          comment={comment}
                          setContentLoading={setContentLoading}
                          contentLoading={contentLoading?.[index]}
                          postCollectGif={postCollectGif}
                          dispatch={dispatch}
                          commentLoading={interactionsLoading?.[index]?.comment}
                          id={item?.id}
                        />
                      )}
                    </>
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
