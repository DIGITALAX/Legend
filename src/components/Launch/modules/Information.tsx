import { FunctionComponent } from "react";
import { InformationProps } from "../types/launch.types";
import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";

const Information: FunctionComponent<InformationProps> = ({
  handleImageUpload,
  imageLoading,
  postInformation,
  setPostInformation,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit flex flex-col items-center justify-start">
      <Bar title="Grant Preview" />
      <div className="relative bg-offWhite w-full h-fit flex flex-col items-center justify-start p-3 gap-6 border border-black rounded-b-sm">
        <div className="relative flex flex-row items-center justify-center gap-5 w-full h-fit">
          <div className="relative w-fit h-fit flex items-center justify-center">
            <label className="relative w-60 h-60 rounded-sm border border-black flex items-center justify-center cursor-pointer">
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
                <div className="relative w-full h-full flex items-center justify-center">
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
                onChange={(e) => handleImageUpload(e)}
              />
            </label>
          </div>
          <div className="relative w-full h-fit flex flex-col justify-start items-center gap-4">
            <div className="relative w-full h-fit flex items-center justify-center text-center">
              <input
                className="bg-offWhite text-center flex items-center justify-center font-dog text-black text-sm"
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
                className="bg-offWhite w-full h-full border border-black p-2 rounded-sm font-dog text-black text-xs"
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
        <div className="relative w-full h-fit flex flex-row items-start justify-start gap-4">
          <div className="relative flex flex-col justify-start items-start w-full h-full font-dog text-black text-xs gap-2">
            <div className="relative w-fit h-fit flex justify-start items-start">
              Maintenance Strategy
            </div>
            <div className="relative w-full h-44">
              <textarea
                className="bg-offWhite w-full h-full border border-black p-2 rounded-sm"
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
            <div className="relative w-fit h-fit flex justify-start items-start">
              Tech Stack
            </div>
            <div className="relative w-full h-44">
              <textarea
                className="bg-offWhite w-full h-full border border-black p-2 rounded-sm"
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
            <div className="relative w-fit h-fit flex justify-start items-start">
              Team Experience
            </div>
            <div className="relative w-full h-44">
              <textarea
                className="bg-offWhite w-full h-full border border-black p-2 rounded-sm"
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
