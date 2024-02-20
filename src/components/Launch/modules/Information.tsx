import { FunctionComponent } from "react";
import { InformationProps } from "../types/launch.types";
import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import { COVER_CONSTANTS, INFURA_GATEWAY } from "../../../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";
import { BsShuffle } from "react-icons/bs";

const Information: FunctionComponent<InformationProps> = ({
  handleImageUpload,
  imageLoading,
  postInformation,
  setPostInformation,
}): JSX.Element => {
  return (
    <div className="relative w-full md:w-3/5 min-w-fit h-fit flex flex-col items-center justify-start">
      <Bar title="Grant Info" />
      <div className="relative bg-offWhite w-full min-w-fit h-fit flex flex-col items-center justify-start px-1 sm:px-3 py-3 gap-6 border border-black rounded-b-sm">
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-5 w-full h-fit">
          <div className="relative w-full sm:w-fit h-fit flex items-center justify-center">
            <label className="relative w-full sm:w-60 h-60 rounded-sm border border-black flex items-center justify-center cursor-pointer">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  postInformation?.coverImage
                    ? postInformation?.coverImage
                    : "Qmak9Amfys6xPL1uk8juyBYtsELwNYPZ6pg4b5Yf6HbyS2"
                }`}
                objectFit="cover"
                draggable={false}
                className="relative rounded-sm w-full h-full flex"
              />
              {imageLoading && (
                <div className="absolute w-full h-full flex items-center justify-center">
                  <div
                    className={`animate-spin w-fit h-fit flex items-center justify-center`}
                  >
                    <AiOutlineLoading size={30} color={"#D07BF7"} />
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/png"
                multiple={false}
                hidden
                onChange={(e) => handleImageUpload(e)}
              />
              <div
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center cursor-pointer rounded-full p-1 bg-black border border-acei active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setPostInformation((prev) => ({
                    ...prev,
                    coverImage: COVER_CONSTANTS.sort(() => 0.5 - Math.random())[0],
                  }));
                }}
              >
                <div className="relative w-fit h-fit flex items-center justify-center">
                  <BsShuffle size={10} color={"white"} />
                </div>
              </div>
            </label>
          </div>
          <div className="relative w-full h-fit flex flex-col justify-start items-center gap-4">
            <div className="relative w-full h-fit flex items-center justify-center text-center">
              <input
                className="bg-offWhite text-center flex items-center justify-center w-full h-fit break-all font-dog text-black text-sm"
                placeholder="Grant Title"
                value={postInformation?.title}
                onChange={(e) =>
                  setPostInformation({
                    ...postInformation,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className="relative w-full h-48 flex">
              <textarea
                className="bg-offWhite w-full h-full border border-black p-2 break-all rounded-sm font-dog text-black text-xs"
                placeholder="Grant description..."
                style={{
                  resize: "none",
                }}
                onChange={(e) =>
                  setPostInformation({
                    ...postInformation,
                    description: e.target.value,
                  })
                }
                value={postInformation?.description}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col sm:flex-row items-start justify-start gap-4">
          <div className="relative flex flex-col justify-start items-start w-full h-full font-dog text-black text-xs gap-2">
            <div className="relative w-fit h-fit flex justify-start items-start break-all">
              Maintenance Strategy
            </div>
            <div className="relative w-full h-44">
              <textarea
                className="bg-offWhite w-full h-full border border-black p-2 break-all rounded-sm"
                placeholder="Into the future..."
                style={{
                  resize: "none",
                }}
                onChange={(e) =>
                  setPostInformation({
                    ...postInformation,
                    strategy: e.target.value,
                  })
                }
                value={postInformation?.strategy}
              ></textarea>
            </div>
          </div>
          <div className="relative flex flex-col justify-start items-start w-full h-full font-dog text-black text-xs gap-2">
            <div className="relative w-fit h-fit flex justify-start items-start break-all">
              Tech Stack
            </div>
            <div className="relative w-full h-44">
              <textarea
                className="bg-offWhite w-full h-full border border-black p-2 break-all rounded-sm"
                placeholder="Solidity, NextJS..."
                style={{
                  resize: "none",
                }}
                onChange={(e) =>
                  setPostInformation({
                    ...postInformation,
                    tech: e.target.value,
                  })
                }
                value={postInformation?.tech}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-row items-start justify-start gap-4">
          <div className="relative flex flex-col justify-start items-start w-full h-full font-dog text-black text-xs gap-2">
            <div className="relative w-fit h-fit flex justify-start items-start break-all">
              Team Experience
            </div>
            <div className="relative w-full h-44">
              <textarea
                className="bg-offWhite w-full h-full border border-black p-2 break-all rounded-sm"
                placeholder="Hackathons, projects..."
                style={{
                  resize: "none",
                }}
                onChange={(e) =>
                  setPostInformation({
                    ...postInformation,
                    experience: e.target.value,
                  })
                }
                value={postInformation?.experience}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
