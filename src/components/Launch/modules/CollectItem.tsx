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
import { CollectItemProps, PrintItem } from "../types/launch.types";
import { ItemTypes } from "@/components/Grants/types/grant.types";

const CollectItem: FunctionComponent<CollectItemProps> = ({
  index,
  grantStageLoading,
  item,
  setPriceIndex,
  priceIndex,
}): JSX.Element => {
  return (
    <div className="relative w-72 h-fit flex flex-col">
      <Bar title={`Collect Lvl.${index + 1}`} />
      {item.items?.map((value: PrintItem, indexTwo: number) => {
        return (
          <div
            key={indexTwo}
            className="relative w-full h-fit flex flex-col bg-offWhite gap-2 justify-start items-center p-2 border-b border-x rounded-b-sm border-black"
          >
            <div className="relative w-52 h-52 rounded-sm border border-black flex items-center justify-center">
              {grantStageLoading ? (
                <div className="relative w-fit h-fit flex items-center justify-center">
                  <AiOutlineLoading size={15} color="black" />
                </div>
              ) : (
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${value?.uri.images?.[0]}`}
                  draggable={false}
                  className="rounded-sm"
                />
              )}
            </div>
            <div className="relative flex items-center text-center justify-center w-fit text-3xl font-net break-words">
              {value?.uri?.title}
            </div>
            <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
              <div className="relative flex justify-start items-center">
                Sizes
              </div>
              <div className="relative flex flex-row gap-1 items-center justify-center">
                {(value?.printType === ItemTypes.Sticker
                  ? STICKER_SIZE
                  : value?.printType === ItemTypes.Apparel
                  ? APPAREL_SIZE
                  : POSTER_SIZE
                ).map((item: string, indexThree: number) => {
                  return (
                    <div
                      key={indexThree}
                      className={`relative w-fit h-fit p-1 flex items-center justify-center text-white text-center text-xxs rounded-sm bg-mar border cursor-pointer ${
                        priceIndex?.[index]?.[indexTwo] === indexTwo
                          ? "border-white"
                          : "border-black"
                      }`}
                      onClick={() => {
                        const indexes = [...priceIndex];
                        indexes[index][indexTwo] = indexTwo;
                        setPriceIndex(indexes);
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
            {value?.printType === ItemTypes.Apparel && (
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
            <div className="relative flex justify-center items-center font-dog text-black text-xs">
              $ {value?.prices?.[priceIndex?.[index]?.[indexTwo]]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CollectItem;
