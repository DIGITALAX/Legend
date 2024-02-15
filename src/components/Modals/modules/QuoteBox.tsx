import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { setPost } from "../../../../redux/reducers/postSlice";
import MakeComment from "@/components/Common/modules/MakeComment";
import Publication from "@/components/Common/modules/Publication";
import { PostBoxProps } from "../types/modals.types";

const QuoteBox: FunctionComponent<PostBoxProps> = ({
  dispatch,
  quote,
  postCollectGif,
  router,
  lensConnected,
  caretCoord,
  profilesOpen,
  mentionProfiles,
  setMentionProfiles,
  setProfilesOpen,
  setCaretCoord,
  interactionsLoading,
  contentLoading,
  setContentLoading,
  setMakeComment,
  makeComment,
  comment,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] min-h-[27vh] place-self-center bg-offBlack border border-lima rounded-sm overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-3 p-2 items-start justify-center">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="white"
              size={10}
              onClick={() =>
                dispatch(
                  setPost({
                    actionValue: false,
                  })
                )
              }
            />
          </div>
          {quote && (
            <div className="relative w-full max-h-[10rem] overflow-y-hidden flex items-start justify-center">
              <div className="relative w-5/6 h-full relative items-center justify-center flex flex-col">
                <Publication
                  disabled={true}
                  item={quote}
                  router={router}
                  dispatch={dispatch}
                />
              </div>
              <div className="absolute w-5/6 h-full top-0 left-auto bg-gradient-to-b from-transparent to-offBlack z-10 items-center justify-center flex"></div>
            </div>
          )}
          <div className="relative w-full h-full flex items-center justify-center pb-3">
            <div className="relative h-full w-4/5 items-center justify-center flex">
              <MakeComment
                index={0}
                main
                comment={comment}
                caretCoord={caretCoord}
                setCaretCoord={setCaretCoord}
                setMakePostComment={setMakeComment}
                setMentionProfiles={setMentionProfiles}
                profilesOpen={profilesOpen?.[0]}
                lensConnected={lensConnected}
                makePostComment={makeComment?.[0]}
                mentionProfiles={mentionProfiles}
                setProfilesOpen={setProfilesOpen}
                setContentLoading={setContentLoading}
                contentLoading={contentLoading?.[0]}
                postCollectGif={postCollectGif}
                dispatch={dispatch}
                commentLoading={interactionsLoading?.[0]?.comment}
                id={"quote"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBox;
