import { FunctionComponent, useRef } from "react";
import { MakeCommentProps } from "../types/common.types";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import { Profile } from "../../../../graphql/generated";
import Image from "next/legacy/image";
import handleSearchProfiles from "../../../../lib/lens/helpers/handleSearchProfiles";
import { ImCross } from "react-icons/im";
import { AiOutlineLoading } from "react-icons/ai";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { setPostCollectGif } from "../../../../redux/reducers/postCollectGifSlice";
import MediaSwitch from "./MediaSwitch";
import setPostMedia from "../../../../lib/lens/helpers/setPostMedia";

const MakeComment: FunctionComponent<MakeCommentProps> = ({
  setMakePostComment,
  makePostComment,
  index,
  mentionProfiles,
  setMentionProfiles,
  profilesOpen,
  caretCoord,
  setProfilesOpen,
  lensConnected,
  setCaretCoord,
  main,
  comment,
  dispatch,
  postCollectGif,
  id,
  contentLoading,
  commentLoading,
  setContentLoading,
}): JSX.Element => {
  const textElement = useRef(null);
  return (
    <div className="relative w-full h-fit flex flex-col gap-3 bg-mar/75 border border-lima p-1.5 rounded-sm">
      <div className="relative w-full h-fit flex bg-black text-white border border-lima p-1.5 rounded-sm">
        <div className="relative w-full p-2 border border-white text-white font-dog text-xxs bg-black flex items-center justify-center text-left rounded-md h-40 overflow-y-scroll">
          <textarea
            className="bg-black relative w-full text-xs h-full p-1 flex"
            style={{ resize: "none" }}
            value={makePostComment?.content}
            onChange={(e) => {
              setMakePostComment((prev) => {
                const arr = [...prev];
                arr[index] = {
                  ...arr[index],
                  content: e.target.value,
                };
                return arr;
              });
              handleSearchProfiles(
                e,
                setProfilesOpen,
                setMentionProfiles,
                index,
                lensConnected,
                setCaretCoord,
                textElement
              );
            }}
            ref={textElement}
          ></textarea>
          {mentionProfiles?.length > 0 && profilesOpen && (
            <div
              className={`absolute w-32 border border-white max-h-28 h-fit flex flex-col overflow-y-auto items-start justify-start z-60`}
              style={{
                top: caretCoord.y + 30,
                left: caretCoord.x,
              }}
            >
              {mentionProfiles?.map((user: Profile, indexTwo: number) => {
                const profileImage = createProfilePicture(
                  user?.metadata?.picture
                );
                return (
                  <div
                    key={indexTwo}
                    className={`relative border-y border-white w-full h-10 px-3 py-2 bg-black flex flex-row gap-3 cursor-pointer items-center justify-center`}
                    onClick={() => {
                      setProfilesOpen((prev) => {
                        const arr = [...prev];
                        arr[index] = false;
                        return arr;
                      });

                      setMakePostComment((prev) => {
                        const arr = [...prev];
                        arr[index] = {
                          ...arr[index],
                          content:
                            makePostComment?.content?.substring(
                              0,
                              makePostComment?.content?.lastIndexOf("@")
                            ) +
                            `${user?.handle?.suggestedFormatted?.localName}`,
                        };
                        return arr;
                      });
                    }}
                  >
                    <div className="relative flex flex-row w-full h-full text-white font-dog items-center justify-center gap-2 text-xxs">
                      <div
                        className={`relative rounded-full flex bg-black w-3 h-3 items-center justify-center`}
                      >
                        {profileImage && (
                          <Image
                            src={profileImage}
                            objectFit="cover"
                            alt="pfp"
                            layout="fill"
                            className="relative w-fit h-fit rounded-full items-center justify-center flex"
                            draggable={false}
                          />
                        )}
                      </div>
                      <div className="relative items-center justify-center w-fit h-fit text-xxs flex">
                        {user?.handle?.suggestedFormatted?.localName}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-col sm:flex-row items-stretch justify-center sm:items-center sm:justify-between sm:gap-1.5 gap-4">
        <div className="relative w-full sm:w-fit h-fit items-center justify-start flex flex-row gap-2">
          {[
            ["QmetvVH6tdXP4ZfvB7ihH9J9oQ6KfVUVVktyHpbbaAzztX", "image"],
            ["QmNd2Rj7tzTJiN7vMbWaFoYJuUARUfEnXRpjKRkQ4uEKoD", "video"],
            ["QmVxaEvPaBfLdLfYX2bUV2Dze6NRDCtepHz7y4NJ6xojue", "gifs"],
            [
              "QmXA7NqjfnoLMWBoA2KsesRQb1SNGQBe2SBxkcT2jEtT4G",
              "collect options",
            ],
          ].map((image: string[], indexTwo: number) => {
            const loaders = [contentLoading?.image, contentLoading?.video];
            return loaders[indexTwo] ? (
              <div
                key={indexTwo}
                className={`relative w-5 h-5 flex items-center justify-center  ${
                  loaders[indexTwo] && "animate-spin"
                }`}
                title={image[1]}
              >
                <AiOutlineLoading size={15} color={"white"} />
              </div>
            ) : indexTwo !== 2 && indexTwo !== 3 ? (
              <label
                key={indexTwo}
                className={`relative flex items-center justify-center cursor-pointer active:scale-95 w-5 h-5`}
                title={image[1]}
              >
                {
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                    draggable={false}
                  />
                }
                <input
                  hidden
                  type="file"
                  accept={indexTwo === 0 ? "image/png, image/gif" : "video/mp4"}
                  multiple={true}
                  onChange={(e) =>
                    e?.target?.files?.[0] &&
                    setPostMedia(
                      e,
                      image[1],
                      setMakePostComment,
                      setContentLoading,
                      index
                    )
                  }
                />
              </label>
            ) : (
              <div
                key={indexTwo}
                className={`relative flex items-center justify-center cursor-pointer active:scale-95 w-5 h-5`}
                title={image[1]}
                onClick={() =>
                  dispatch(
                    setPostCollectGif({
                      actionType: indexTwo === 2 ? "gif" : "collect",
                      actionId: id,
                      actionGifs: postCollectGif?.gifs,
                      actionCollectTypes: postCollectGif?.collectTypes,
                    })
                  )
                }
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
        <div className="relative w-full sm:w-fit h-fit items-center justify-end flex">
          <div
            className={`relative w-20 h-8 font-dog text-black flex items-center justify-center bg-lima border border-black text-super rounded-sm ${
              !commentLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() => !commentLoading && comment(id, main)}
          >
            <div
              className={`${
                commentLoading && "animate-spin"
              } relative w-fit h-fit flex items-center justify-center text-center`}
            >
              {commentLoading ? (
                <AiOutlineLoading size={15} color="black" />
              ) : (
                "Send It"
              )}
            </div>
          </div>
        </div>
      </div>
      {((postCollectGif?.gifs?.[id!] &&
        postCollectGif?.gifs?.[id!]?.length > 0) ||
        makePostComment?.images?.length > 0 ||
        makePostComment?.videos?.length > 0) && (
        <div className="relative w-[30rem] h-fit flex overflow-x-scroll justify-start items-start pt-4">
          <div className="relative gap-4 items-center justify-start flex flex-row w-fit h-fit">
            {[
              ...makePostComment?.videos?.map((video) => ({
                type: "video",
                item: video,
              })),
              ...makePostComment?.images?.map((image) => ({
                type: "image",
                item: image?.media,
              })),
              ...(postCollectGif?.gifs?.[id!] || []).map((gif) => ({
                type: "gif",
                item: gif,
              })),
            ].map(
              (
                media: {
                  type: string;
                  item: string;
                },
                indexTwo: number
              ) => {
                return (
                  <div
                    key={indexTwo}
                    className="relative w-40 h-40 rounded-md flex items-center justify-center border border-white"
                  >
                    <MediaSwitch
                      type={media.type !== "video" ? "image" : "video"}
                      classNameImage={"rounded-md"}
                      classNameAudio={"rounded-md"}
                      classNameVideo={{
                        objectFit: "cover",
                        display: "flex",
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyItems: "center",
                        borderRadius: "0.375rem",
                        position: "relative",
                      }}
                      srcUrl={media?.item}
                    />
                    <div
                      className="absolute w-5 h-5 bg-black p-px -right-2 -top-2 bg-black rounded-full cursor-pointer flex items-center justify-center border border-white"
                      onClick={() => {
                        if (media?.type === "gif") {
                          const newGifs = { ...postCollectGif.gifs };
                          newGifs[id] = newGifs[id].filter(
                            (gif) => gif !== media?.item
                          );
                          dispatch(
                            setPostCollectGif({
                              actionGifs: newGifs,
                              actionCollectTypes: postCollectGif?.collectTypes,
                            })
                          );
                        } else {
                          setMakePostComment((prev) => {
                            const arr = [...prev];
                            arr[index] = {
                              ...arr[index],
                              images:
                                media.type === "image"
                                  ? (arr[index]?.images ?? []).filter(
                                      (_, i) => i !== indexTwo
                                    )
                                  : arr[index]?.images,
                              videos:
                                media.type === "video"
                                  ? (arr[index]?.videos ?? []).filter(
                                      (_, i) => i !== indexTwo
                                    )
                                  : arr[index]?.videos,
                            };
                            return arr;
                          });
                        }
                      }}
                    >
                      <ImCross color={"white"} size={8} />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeComment;
