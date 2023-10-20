import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import {
  APPAREL_SIZE,
  INFURA_GATEWAY,
  POSTER_SIZE,
  STICKER_SIZE,
} from "../../../../lib/constants";
import { CollectItemProps, PrintType } from "../types/launch.types";
import PurchaseTokens from "@/components/Common/modules/PurchaseTokens";
import Splits from "./Splits";

const CollectItem: FunctionComponent<CollectItemProps> = ({
  index,
  allCollectionsLoading,
  item,
  handleChangeCurrency,
  handleChangeImage,
  handleChangeItem,
}): JSX.Element => {
  const fulfillerBase =
    Number(item.items[index.itemIndex]?.fulfillerBase) / 10 ** 18;
  const fulfillerPercent =
    Number(item.items[index.itemIndex]?.fulfillerPercent) / 10000;
  const designerPercent =
    Number(item.items[index.itemIndex]?.designerPercent) / 10000;
  const total = (index.price[index.priceIndex] ) / 10 ** 18;

  const fulfillerShare = fulfillerPercent * (total - fulfillerBase) + fulfillerBase;
  const designerShare = designerPercent * (total - fulfillerBase);
  const granteeShare = (total) - designerShare - fulfillerShare;

  return (
    <div className="relative w-72 h-full flex flex-col items-center justify-start">
      <Bar title={`Collect Lvl.${index.levelIndex + 1}`} />
      <div className="relative w-full h-110 flex flex-col gap-2 justify-between items-center p-2 border-b border-x rounded-b-sm border-black bg-offWhite">
        {allCollectionsLoading ? (
          <div className="relative w-48 h-48 rounded-sm border border-black flex items-center justify-center">
            <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
              <AiOutlineLoading size={15} color="black" />
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col gap-2 w-full h-fit items-center justify-center">
            {item.items.length > 1 && (
              <div className="relative w-full h-fit flex items-center justify-center flex-row gap-1.5 text-xxs text-white font-dog">
                <div
                  className={`relative w-fit h-6 items-center px-1.5 justify-center flex bg-mar border border-white rounded-md cursor-pointer active:scale-95`}
                  onClick={() =>
                    handleChangeItem(
                      index.levelIndex,
                      index.itemIndex < item.items.length - 1
                        ? index.itemIndex + 1
                        : 0
                    )
                  }
                >
                  {`<<<`}
                </div>
                <div
                  className={`relative w-fit h-6 text-white font-dog items-center px-1.5 justify-center flex bg-mar border border-white rounded-md cursor-pointer active:scale-95`}
                  onClick={() =>
                    handleChangeItem(
                      index.levelIndex,
                      index.itemIndex > 0
                        ? index.itemIndex - 1
                        : item.items.length - 1
                    )
                  }
                >
                  {`>>>`}
                </div>
              </div>
            )}
            <div className="relative w-52 h-52 rounded-sm border border-black flex items-center justify-center">
              {item.items[index.itemIndex]?.uri.images?.[
                index.imageIndex
              ]?.split("ipfs://")[1] && (
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${
                    item.items[index.itemIndex]?.uri.images?.[
                      index.imageIndex
                    ]?.split("ipfs://")[1]
                  }`}
                  draggable={false}
                  className="rounded-sm"
                  objectFit="cover"
                  objectPosition={"top"}
                />
              )}
              <div className="absolute w-fit h-5 flex flex-row bg-white border border-black rounded-x-xl items-center justify-between bottom-2">
                <div className="relative w-fit h-fit flex items-center justify-center p-1">
                  <div
                    className="relative w-2 h-2 flex items-center justify-center cursor-pointer active:scale-95"
                    onClick={() =>
                      handleChangeImage(
                        index.levelIndex,
                        index.imageIndex <
                          item.items[index.itemIndex]?.uri.images.length - 1
                          ? index.imageIndex + 1
                          : 0
                      )
                    }
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/QmcwhhhhfjDag6vJ6F5f9U25oGruB8kMiHzUL4yPQ9txyG`}
                      draggable={false}
                    />
                  </div>
                </div>
                <div className="relative bg-black h-full w-px flex"></div>
                <div className="relative w-fit h-fit flex items-center justify-center p-1">
                  <div
                    className="relative w-2 h-2 flex items-center justify-center rotate-180 cursor-pointer active:scale-95"
                    onClick={() =>
                      handleChangeImage(
                        index.levelIndex,
                        index.imageIndex > 0
                          ? index.imageIndex - 1
                          : item.items[index.itemIndex]?.uri.images.length - 1
                      )
                    }
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/QmcwhhhhfjDag6vJ6F5f9U25oGruB8kMiHzUL4yPQ9txyG`}
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="relative flex items-center text-center justify-center w-fit text-sm font-net break-words">
          {item.items[index.itemIndex]?.uri?.title}
        </div>
        <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
          <div className="relative flex justify-start items-center">Sizes</div>
          <div className="relative flex flex-row gap-1 items-center justify-center">
            {(item.items[index.itemIndex]?.printType === PrintType.Sticker
              ? STICKER_SIZE
              : item.items[index.itemIndex]?.printType === PrintType.Shirt ||
                item.items[index.itemIndex]?.printType === PrintType.Hoodie
              ? APPAREL_SIZE
              : POSTER_SIZE
            ).map((value: string, indexThree: number) => {
              return (
                <div
                  key={indexThree}
                  className={`relative ${
                    item.items[index.itemIndex]?.printType !==
                      PrintType.Shirt &&
                    item.items[index.itemIndex]?.printType !== PrintType.Hoodie
                      ? "w-fit h-fit rounded-sm"
                      : "w-6 h-6 rounded-full border-black"
                  } p-1 flex items-center justify-center text-white text-center text-super bg-mar border uppercase  ${
                    item.items[index.itemIndex]?.printType !==
                      PrintType.Shirt &&
                    item.items[index.itemIndex]?.printType !==
                      PrintType.Hoodie &&
                    `cursor-pointer ${
                      index.priceIndex === indexThree
                        ? "border-white"
                        : "border-black"
                    }`
                  }
                  }`}
                  onClick={() =>
                    handleChangeCurrency(
                      index.levelIndex,
                      index.itemIndex,
                      item.items[index.itemIndex]?.printType ===
                        PrintType.Shirt ||
                        item.items[index.itemIndex]?.printType ===
                          PrintType.Hoodie
                        ? 0
                        : indexThree,
                      index.currency
                    )
                  }
                >
                  {value}
                </div>
              );
            })}
          </div>
        </div>
        {(item.items[index.itemIndex]?.printType === PrintType.Shirt ||
          item.items[index.itemIndex]?.printType === PrintType.Hoodie) && (
          <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
            <div className="relative flex justify-start items-center">
              Base Colors
            </div>
            <div className="relative flex flex-row gap-1 items-center justify-center">
              {["#000000", "#FFFFFF", "#97D1FD", "#F66054"].map(
                (item: string, indexThree: number) => {
                  return (
                    <div
                      key={indexThree}
                      className={`relative w-5 h-5 rounded-full border-black border`}
                      style={{
                        backgroundColor: item,
                      }}
                    ></div>
                  );
                }
              )}
            </div>
          </div>
        )}
        <Splits
          grantee={Number(((granteeShare / total) * 100).toFixed(2))}
          designer={Number(((designerShare / total) * 100).toFixed(2))}
          fulfiller={Number(((fulfillerShare / total) * 100).toFixed(2))}
        />
        <PurchaseTokens
          levelIndex={index.levelIndex}
          currency={index.currency}
          handleChangeCurrency={handleChangeCurrency}
          itemIndex={index.itemIndex}
          priceIndex={index.priceIndex}
        />
        <div className="relative flex justify-center items-center font-dog text-black text-xxs">
          {`${Number(
            (index.price[index.priceIndex] / index.rate)?.toFixed(2)
          )} ${index.currency}`}
        </div>
      </div>
    </div>
  );
};

export default CollectItem;
