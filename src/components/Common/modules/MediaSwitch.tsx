import Image from "next/legacy/image";
import { FunctionComponent, useState } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { MediaProps } from "../types/common.types";
import Waveform from "./Waveform";

const MediaSwitch: FunctionComponent<MediaProps> = ({
  type,
  srcUrl,
  srcCover,
  classNameVideo,
  classNameImage,
  classNameAudio,
  objectFit,
  hidden,
}): JSX.Element => {
  const [videoInfo, setVideoInfo] = useState<{
    loading: boolean;
    currentTime: number;
    duration: number;
    isPlaying: boolean;
  }>({
    loading: false,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
  });
  switch (type?.toLowerCase()) {
    case "video":
      return (
        <>
          <video
            controls={false}
            poster={srcCover}
            loop={hidden}
            autoPlay={hidden}
            muted={true}
          >
            <source
              src={
                srcUrl?.includes("https://")
                  ? srcUrl
                  : `${INFURA_GATEWAY}/ipfs/${
                      srcUrl?.includes("ipfs://")
                        ? srcUrl?.split("ipfs://")[1]
                        : srcUrl
                    }`
              }
            />
          </video>
          <div id={srcUrl} style={classNameVideo}></div>
          {!hidden && (
            <Waveform
              audio={srcUrl}
              type={"video"}
              keyValue={srcUrl}
              video={srcUrl}
              handlePauseVideo={() =>
                setVideoInfo((prev) => {
                  return {
                    ...prev,
                    isPlaying: false,
                  };
                })
              }
              handlePlayVideo={() =>
                setVideoInfo((prev) => {
                  return {
                    ...prev,
                    isPlaying: true,
                  };
                })
              }
              handleSeekVideo={(e) =>
                setVideoInfo((prev) => ({
                  ...prev,
                  currentTime: e,
                }))
              }
              videoInfo={videoInfo}
            />
          )}
        </>
      );

    case "audio":
      const keyValueAudio = srcUrl + Math.random().toString();
      return (
        <>
          <Image
            src={srcCover!}
            layout="fill"
            objectFit={objectFit ? "contain" : "cover"}
            className={classNameAudio}
            draggable={false}
          />
          {!hidden && (
            <Waveform
              audio={srcUrl}
              type={"audio"}
              keyValue={keyValueAudio}
              video={srcUrl}
            />
          )}
        </>
      );

    default:
      return (
        <Image
          src={srcUrl}
          layout="fill"
          objectFit={objectFit ? "contain" : "cover"}
          objectPosition={"center"}
          className={classNameImage}
          draggable={false}
        />
      );
  }
};

export default MediaSwitch;
