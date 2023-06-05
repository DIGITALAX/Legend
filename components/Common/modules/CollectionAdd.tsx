import { FormEvent, FunctionComponent } from "react";
import Draggable from "react-draggable";
import TopBarTwo from "./TopBarTwo";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { CollectionAddProps } from "../types/common.types";
import { AiOutlineLoading } from "react-icons/ai";

const CollectionAdd: FunctionComponent<CollectionAddProps> = ({
  deleteFunction,
  position,
  editionAmount,
  productInformation,
  handleTitle,
  handleDescription,
  handleCollectionPrices,
  handleEditionAmount,
  index,
  imageLoading,
  handleImageUpload,
  minted,
  collectionLoading,
  mintCollection,
  handleDiscount,
  handleGrantOnly,
  handlePrintType,
}): JSX.Element => {
  return (
    <Draggable enableUserSelectHack={false}>
      <div
        className={`${
          position ? "absolute" : "relative"
        } w-80 h-fit flex gap-3 bg-white border-2 border-mazul cursor-grab active:cursor-grabbing `}
        style={{
          top: `${position && position.y}px`,
          right: `${position && position.x}px`,
        }}
      >
        <div className="relative w-full h-full items-center flex flex-col">
          <TopBarTwo deleteFunction={deleteFunction} />
          <div className="p-2 flex w-full h-full flex-col gap-3 items-center">
            <label
              className="w-full h-52 border border-black bg-mist items-center justify-center flex cursor-pointer"
              onChange={(e: FormEvent) => handleImageUpload(e, index)}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {imageLoading[index] ? (
                  <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                    <AiOutlineLoading size={15} color="white" />
                  </div>
                ) : productInformation?.uri?.image ? (
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/${productInformation?.uri?.image}`}
                    draggable={false}
                    objectFit="cover"
                  />
                ) : (
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/QmV4pRmrrve6j3n5p8yTpgTcstxggh2Vz48GRg7ryZreNh`}
                      draggable={false}
                    />
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="png"
                hidden
                required
                id="files"
                multiple={false}
                name="images"
                className="caret-transparent"
                disabled={imageLoading[index] ? true : false}
              />
            </label>
            <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
              <div className="relative w-fit justify-start h-fit flex font-mega text-mazul text-xl">
                Name of Collection
              </div>
              <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                <div className="absolute w-full h-full flex opacity-70">
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                    draggable={false}
                  />
                </div>
                <textarea
                  className="relative w-full h-full flex p-2 text-black font-earl text-sm bg-transparent rounded-md"
                  style={{ resize: "none" }}
                  onChange={(e: FormEvent) => handleTitle(e, index)}
                ></textarea>
              </div>
            </div>
            <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
              <div className="relative w-fit h-fit flex font-mega text-mazul text-sm">
                Description
              </div>
              <div className="relative w-full h-14 flex items-center justify-center rounded-md border border-black">
                <div className="absolute w-full h-full flex opacity-70">
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                    draggable={false}
                  />
                </div>
                <textarea
                  className="relative w-full h-full flex p-2 text-black font-earl text-sm bg-transparent rounded-md"
                  style={{ resize: "none" }}
                  onChange={(e: FormEvent) => handleDescription(e, index)}
                ></textarea>
              </div>
            </div>
            <div className="relative grid grid-cols-4 gap-2 w-full h-fit font-earl">
              {Array.from([
                [
                  "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
                  "WMATIC",
                  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
                ],
                [
                  "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
                  "WETH",
                  "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                ],
                [
                  "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
                  "USDT",
                  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
                ],
                [
                  "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
                  "MONA",
                  "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
                ],
              ])
                .map((item: string[]) => {
                  if (
                    productInformation?.acceptedTokens?.includes(
                      item[2].toLowerCase()
                    )
                  ) {
                    const acceptedTokenIndex =
                      productInformation?.acceptedTokens?.findIndex(
                        (token: string) =>
                          token.toLowerCase() === item[2].toLowerCase()
                      );

                    return {
                      ...item,
                      price: String(
                        productInformation?.basePrices?.[acceptedTokenIndex]
                      ),
                    };
                  } else {
                    return {
                      ...item,
                      price: "",
                    };
                  }
                })
                .map((value: string[], indexTwo: number) => {
                  return (
                    <div
                      key={indexTwo}
                      className="relative w-full h-fit flex flex-col gap-1 items-center justify-start"
                    >
                      <div className="relative flex flex-row gap-1 w-full h-fit items-center">
                        <div className="relative w-4 h-5 flex rounded-full items-center justify-center">
                          <Image
                            src={`${INFURA_GATEWAY}/${value[0]}`}
                            draggable={false}
                            layout="fill"
                            className="flex"
                          />
                        </div>
                        <div className="relative w-fit h-full flex items-center justify-start text-xs">
                          <div className="relative flex w-full h-full items-center top-px">
                            {value[1]}
                          </div>
                        </div>
                      </div>
                      <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                        <div className="absolute w-full h-full flex opacity-70">
                          <Image
                            layout="fill"
                            src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                            draggable={false}
                          />
                        </div>
                        <input
                          className="relative w-full h-full flex p-2 text-black font-earl text-sm bg-transparent rounded-md"
                          style={{ resize: "none" }}
                          type="number"
                          onChange={(e: FormEvent) =>
                            handleCollectionPrices(e, value[2], index)
                          }
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="relative w-full h-full flex flex-row gap-4 items-end justify-end">
              <div className="relative w-fit h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-fit h-fit flex font-earl text-mazul text-xs">
                  Grant Collectors Only
                </div>
                <div
                  className={`rounded-md relative border border-black flex w-full text-center text-sm justify-center items-center h-fit py-1.5 font-earl text-white uppercase px-3 cursor-pointer active:scale-95 ${
                    productInformation.grantOnly
                      ? "bg-darker"
                      : "bg-blez opacity-70"
                  }`}
                  onClick={(e: FormEvent) => handleGrantOnly(e, index)}
                >
                  {productInformation.grantOnly ? "yes" : "no"}
                </div>
              </div>
              <div className="relative w-fit h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-fit h-fit flex font-earl text-mazul text-xs">
                  Grant Collectors Discount %
                </div>
                <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                  <div className="absolute w-full h-full flex opacity-70">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  <input
                    className="relative w-full h-full flex p-2 text-black font-earl text-sm bg-transparent rounded-md"
                    style={{ resize: "none" }}
                    type="number"
                    defaultValue={0}
                    onChange={(e: FormEvent) => handleDiscount(e, index)}
                  />
                </div>
              </div>
            </div>
            <div className="relative w-full h-full flex flex-row gap-4 items-end justify-end">
              <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-fit h-fit flex font-mega text-mazul text-sm">
                  Amount
                </div>
                <div className="relative w-1/4 h-8 flex items-center justify-center rounded-md border border-black">
                  <div className="absolute w-full h-full flex opacity-70">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  <input
                    className="relative w-full h-full flex p-2 text-black font-earl text-sm bg-transparent rounded-md"
                    style={{ resize: "none" }}
                    type="number"
                    defaultValue={editionAmount}
                    onChange={(e: FormEvent) => handleEditionAmount(e, index)}
                  />
                </div>
              </div>
              <div className="relative w-fit h-full flex items-end justify-end">
                <div
                  className={`relative border border-black flex w-16 text-center text-sm justify-center items-center h-8 py-1.5 font-earl text-white uppercase px-3 ${
                    !minted[index] &&
                    productInformation.uri.name !== "" &&
                    productInformation.basePrices.length > 0 &&
                    productInformation.uri.description !== "" &&
                    productInformation.uri.image !== "" &&
                    productInformation.amount !== 0
                      ? "cursor-pointer active:scale-95 bg-darker"
                      : "bg-blez opacity-70"
                  }`}
                  onClick={() =>
                    !minted[index] &&
                    productInformation.uri.name !== "" &&
                    productInformation.basePrices.length > 0 &&
                    productInformation.uri.description !== "" &&
                    productInformation.uri.image !== "" &&
                    productInformation.amount !== 0 &&
                    mintCollection(index)
                  }
                >
                  {collectionLoading[index] ? (
                    <div className="animate-spin w-fit h-fit">
                      <AiOutlineLoading color="white" size={15} />
                    </div>
                  ) : !minted[index] ? (
                    "mint"
                  ) : (
                    "minted"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default CollectionAdd;
