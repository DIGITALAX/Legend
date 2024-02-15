import { FunctionComponent } from "react";
import {
  ImageMetadataV3,
  PublicationMetadataMedia,
} from "../../../../graphql/generated";
import MakeComment from "./MakeComment";
import { metadataMedia } from "../../../../lib/lens/helpers/postMetadata";
import { setMediaExpand } from "../../../../redux/reducers/mediaExpandSlice";
import MediaSwitch from "./MediaSwitch";
import descriptionRegex from "../../../../lib/graph/helpers/descriptionRegex";
import Interactions from "@/components/Grants/modules/Interactions";
import { PublicationProps } from "../types/common.types";

const Publication: FunctionComponent<PublicationProps> = ({
  dispatch,
  index,
  like,
  comment,
  bookmark,
  item,
  router,
  caretCoord,
  setCaretCoord,
  setMakeComment,
  setMentionProfiles,
  profilesOpen,
  lensConnected,
  makeComment,
  mentionProfiles,
  setProfilesOpen,
  setContentLoading,
  contentLoading,
  postCollectGif,
  interactionsLoading,
  setMirrorChoiceOpen,
  mirrorChoiceOpen,
  mirror,
  setCommentBoxOpen,
  commentBoxOpen,
  disabled,
}): JSX.Element => {
  return (
    <>
      <div className="relative w-full max-h-[28rem] flex items-start justify-start overflow-x-scroll">
        <div className="relative w-full h-fit flex items-start justify-start flex-row gap-2">
          {[
            (item?.metadata as ImageMetadataV3)?.asset,
            ...((item?.metadata as ImageMetadataV3)?.attachments || []),
          ].filter(Boolean)?.length > 0 &&
            [
              (item?.metadata as ImageMetadataV3)?.asset,
              ...((item?.metadata as ImageMetadataV3)?.attachments || []),
            ]?.map((img: PublicationMetadataMedia, index: number) => {
              const media = metadataMedia(img);
              return (
                <div
                  className="relative w-24 h-24 flex border border-mar rounded-sm cursor-pointer bg-offBlack"
                  key={index}
                  onClick={() =>
                    !disabled &&
                    dispatch!(
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
            })}
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
      {!disabled && (
        <Interactions
          like={like!}
          index={index!}
          interactionsLoading={interactionsLoading?.[index!]!}
          setMirrorChoiceOpen={setMirrorChoiceOpen!}
          mirrorChoiceOpen={mirrorChoiceOpen?.[index!]!}
          mirror={mirror!}
          dispatch={dispatch!}
          router={router!}
          bookmark={bookmark!}
          post={item}
          setCommentBoxOpen={setCommentBoxOpen!}
        />
      )}
      {commentBoxOpen?.[index!] && !disabled && (
        <MakeComment
          index={index!}
          caretCoord={caretCoord!}
          setCaretCoord={setCaretCoord!}
          setMakePostComment={setMakeComment!}
          setMentionProfiles={setMentionProfiles!}
          profilesOpen={profilesOpen?.[index!]!}
          lensConnected={lensConnected!}
          makePostComment={makeComment?.[index!]!}
          mentionProfiles={mentionProfiles!}
          setProfilesOpen={setProfilesOpen!}
          comment={comment!}
          setContentLoading={setContentLoading!}
          contentLoading={contentLoading?.[index!]!}
          postCollectGif={postCollectGif!}
          dispatch={dispatch!}
          commentLoading={interactionsLoading?.[index!]?.comment!}
          id={item?.id}
        />
      )}
    </>
  );
};

export default Publication;
