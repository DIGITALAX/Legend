import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { setMediaExpand } from "../../../../redux/reducers/mediaExpandSlice";
import { MediaExpandProps } from "../types/modals.types";

const MediaExpand: FunctionComponent<MediaExpandProps> = ({
  dispatch,
  image,
  type,
}): JSX.Element => {
  return (
    <div
      className="inset-0 fixed z-60 bg-opacity-50 backdrop-blur-sm overflow-y-hidden w-screen h-screen items-center justify-center"
      onClick={() =>
        dispatch(
          setMediaExpand({
            actionType: "",
            actionValue: false,
            actionMedia: "",
          })
        )
      }
    >
      <div className="relative w-full h-full flex items-center justify-center p-8">
        <div className="relative w-4/5 h-full flex items-center justify-center">
          {!type?.includes("video") && !type?.includes("audio") ? (
            <Image
              src={image}
              layout="fill"
              objectFit="contain"
              draggable={false}
            />
          ) : type?.includes("audio") ? (
            <audio
              muted
              controls
              className="rounded-md absolute w-full h-full object-cover"
            >
              <source src={image} />
            </audio>
          ) : (
            <video
              muted
              controls
              className="rounded-md absolute w-full h-full object-cover"
            >
              <source src={image} />
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaExpand;
