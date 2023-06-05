import Image from "next/legacy/image";
import { FormEvent, FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ImageUploadDynamicProps } from "../types/launch.types";
import TopBarOne from "@/components/Common/modules/TopBarOne";
import Draggable from "react-draggable";
import TopBarTwo from "@/components/Common/modules/TopBarTwo";
import { INFURA_GATEWAY } from "@/lib/constants";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableImage from "@/components/Common/modules/DraggableImage";

const ImageUploadDynamic: FunctionComponent<ImageUploadDynamicProps> = ({
  zipLoading,
  uploadZip,
  fileUploadCount,
  editionAmount,
  fileUploadAmount,
  currentImageIndex,
  setCurrentImageIndex,
  NFTURIValues,
  handleDropImage,
}): JSX.Element => {
  console.log({ NFTURIValues });
  return (
    <div className="relative w-full h-full items-center justify-center flex py-5 flex flex-row gap-36">
      <Draggable enableUserSelectHack={false}>
        <div className="relative w-96 h-fit flex gap-3 bg-lez border-2 border-mazul cursor-grab active:cursor-grabbing">
          <div className="relative w-full h-full bg-lez items-center flex flex-col">
            <TopBarOne />
            <div className="p-2 flex w-full h-full flex-row gap-1">
              <div className="relative w-full h-full flex flex-col gap-3 p-2">
                <div className="relative w-fit h-fit font-earl text-black text-sm text-center flex flex-col items-center justify-center">
                  Upload a zip file that includes the images to evolve as your
                  grant is collected. <br /> <br />
                  <div className="relative font-mega border-black border-2 bg-mazul text-white text-center h-fit w-3/4 items-center justify-center px-2 py-4 rounded-md flex">
                    <div className="relative w-fit h-fit flex">
                      If you want your dynamic NFT to evolve with every collect,
                      make sure your zip file contains the same amount of unique
                      images as your edition amount ({editionAmount}), otherwise
                      your NFT will only be dynamic with some collects.
                    </div>
                  </div>
                  <br /> Only zips with all files as PNGs will be hashed to
                  IPFS.
                </div>
                <div className="relative w-full h-fit items-center justify-center flex">
                  <label
                    className={`relative bg-darker border border-black flex w-20 text-center justify-center items-center h-8 p-1 font-mega text-white uppercase ${
                      !zipLoading && "cursor-pointer active:scale-95"
                    }`}
                    onChange={(e: FormEvent) => {
                      !zipLoading ? uploadZip(e) : {};
                    }}
                  >
                    <div
                      className={`relative w-fit h-fit flex items-center justify-center text-xs ${
                        zipLoading && "animate-spin"
                      }`}
                    >
                      {zipLoading ? (
                        <AiOutlineLoading color="white" size={15} />
                      ) : (
                        "UPLOAD"
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".zip,application/zip"
                      hidden
                      required
                      id="files"
                      multiple={false}
                      name="images"
                      className="caret-transparent"
                      disabled={zipLoading ? true : false}
                    />
                  </label>
                </div>
                <div className="relative w-full h-fit flex font-mega text-mazul rounded-md text-xs uppercase pt-6 justify-end">
                  dynamic art upload
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false} cancel=".stopDrag">
        <div className="relative w-100 h-3/4 flex gap-3 bg-white border-2 border-mazul cursor-grab active:cursor-grabbing">
          <div className="relative w-full h-full bg-white items-center flex flex-col gap-6">
            <TopBarTwo />
            <div className="relative w-60 h-60 rounded-lg border border-mazul items-center justify-center flex">
              {NFTURIValues.length > 1 && NFTURIValues[currentImageIndex] ? (
                <Image
                  src={`${INFURA_GATEWAY}/${NFTURIValues[currentImageIndex]}`}
                  layout="fill"
                  objectFit="cover"
                  draggable={false}
                />
              ) : (
                <div className="relative w-fit h-fit flex items-center justify-center animate-spin opacity-70">
                  <AiOutlineLoading color="black" size={15} />
                </div>
              )}
            </div>
            <div className="relative flex flex-row w-full h-fit gap-1 items-center justify-center">
              <div
                className={`relative bg-darker border border-black flex w-14 text-center text-sm justify-center items-center h-fit p-1 font-earl text-white uppercase cursor-pointer active:scale-95`}
                onClick={() =>
                  setCurrentImageIndex(
                    (currentImageIndex - 1 + fileUploadAmount) %
                      fileUploadAmount
                  )
                }
              >
                {`<--`}
              </div>
              <div
                className={`relative bg-darker border border-black flex w-14 text-center text-sm justify-center items-center h-fit p-1 font-earl text-white uppercase cursor-pointer active:scale-95`}
                onClick={() =>
                  setCurrentImageIndex(
                    (currentImageIndex + 1) % fileUploadAmount
                  )
                }
              >
                {`-->`}
              </div>
            </div>
            <div className="stopDrag p-2 flex w-full h-fit flex-row gap-1">
              <div className="relative w-full h-fit flex items-center justify-center rounded-md">
                <div className="relative w-full h-full flex  overflow-x-scroll pt-5">
                  <div className="relative w-fit h-full flex flex-row gap-2">
                    <DndProvider backend={HTML5Backend}>
                      {(NFTURIValues.length > 0
                        ? NFTURIValues
                        : Array.from({ length: fileUploadAmount })
                      ).map((_, index: number) => {
                        return (
                          <DraggableImage
                            key={index}
                            index={index}
                            onDropImage={handleDropImage}
                          >
                            <div
                              className="relative w-20 h-20 rounded-md border border-dashed border-black/50 flex items-center justify-center cursor-pointer"
                              onClick={() => setCurrentImageIndex(index)}
                            >
                              {NFTURIValues[index] ? (
                                <Image
                                  src={`${INFURA_GATEWAY}/${NFTURIValues[index]}`}
                                  className="w-full h-full object-cover rounded-md"
                                  layout="fill"
                                  objectFit="cover"
                                  draggable={false}
                                />
                              ) : (
                                zipLoading && (
                                  <div className="relative w-fit h-fit animate-spin items-center justify-center opacity-80 flex">
                                    <AiOutlineLoading color="black" size={15} />
                                  </div>
                                )
                              )}
                            </div>
                          </DraggableImage>
                        );
                      })}
                    </DndProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default ImageUploadDynamic;
