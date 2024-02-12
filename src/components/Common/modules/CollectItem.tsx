import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import { CollectItemProps, PrintType } from "../../Launch/types/launch.types";
import PurchaseTokens from "@/components/Common/modules/PurchaseTokens";
import Splits from "../../Launch/modules/Splits";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";

const CollectItem: FunctionComponent<CollectItemProps> = ({
  levelInfo,
  levelsLoading,
  setDetails,
  details,
  cart,
  dispatch,
  cartItems,
  grant,
  router,
  oracleData,
  mainIndex,
}): JSX.Element => {
  return (
    <div className="relative w-72 h-full flex flex-col items-center justify-start">
      <Bar title={`Collect Lvl.${levelInfo.level}`} />
      <div className="relative w-full h-110 flex flex-col gap-2 justify-between items-center p-2 border-b border-x rounded-b-sm border-black bg-offWhite">
        {levelsLoading ? (
          <div className="relative w-48 h-48 rounded-sm border border-black flex items-center justify-center">
            <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
              <AiOutlineLoading size={15} color="black" />
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col gap-2 w-full h-fit items-center justify-center">
            {levelInfo?.collectionIds?.length > 1 && (
              <div className="relative w-full h-fit flex items-center justify-center flex-row gap-1.5 text-xxs text-white font-dog">
                <div
                  className={`relative w-fit h-6 items-center px-1.5 justify-center flex bg-mar border border-white rounded-md cursor-pointer active:scale-95`}
                  onClick={() =>
                    setDetails((prev) => {
                      const arr = [...prev];
                      arr[mainIndex][levelInfo.level] = {
                        ...arr[mainIndex][levelInfo.level],
                        collectionIndex:
                          arr[mainIndex][levelInfo?.level]?.collectionIndex -
                            1 >=
                          0
                            ? arr[mainIndex][levelInfo?.level]
                                ?.collectionIndex - 1
                            : levelInfo.collectionIds.length,
                      };

                      return arr;
                    })
                  }
                >
                  {`<<<`}
                </div>
                <div
                  className={`relative w-fit h-6 text-white font-dog items-center px-1.5 justify-center flex bg-mar border border-white rounded-md cursor-pointer active:scale-95`}
                  onClick={() =>
                    setDetails((prev) => {
                      const arr = [...prev];
                      arr[mainIndex][levelInfo.level] = {
                        ...arr[mainIndex][levelInfo.level],
                        collectionIndex:
                          arr[mainIndex][levelInfo?.level]?.collectionIndex +
                            1 <
                          levelInfo.collectionIds.length
                            ? arr[mainIndex][levelInfo?.level]
                                ?.collectionIndex + 1
                            : 0,
                      };

                      return arr;
                    })
                  }
                >
                  {`>>>`}
                </div>
              </div>
            )}
            <div className="relative w-52 h-52 rounded-sm border border-black flex items-center bg-black justify-center">
              {levelInfo?.collectionIds?.[
                details?.collectionIndex
              ]?.collectionMetadata?.images?.[
                details?.imageIndex?.[details.collectionIndex]
              ]?.split("ipfs://")[1] && (
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${
                    levelInfo?.collectionIds?.[
                      details?.collectionIndex
                    ]?.collectionMetadata?.images?.[
                      details?.imageIndex?.[details?.collectionIndex]
                    ]?.split("ipfs://")[1]
                  }`}
                  draggable={false}
                  className="rounded-sm"
                  objectFit="cover"
                  objectPosition={"top"}
                />
              )}
              {levelInfo.collectionIds?.[details?.collectionIndex]
                ?.collectionMetadata?.images?.length > 1 && (
                <div className="absolute w-fit h-5 flex flex-row bg-white border border-black rounded-x-xl items-center justify-between bottom-2">
                  <div className="relative w-fit h-fit flex items-center justify-center p-1">
                    <div
                      className="relative w-2 h-2 flex items-center justify-center cursor-pointer active:scale-95"
                      onClick={() =>
                        setDetails((prev) => {
                          const arr = [...prev];
                          const images = [
                            ...arr[mainIndex][levelInfo.level]?.imageIndex,
                          ];

                          images[details?.collectionIndex] =
                            images[details?.collectionIndex] - 1 >= 0
                              ? images[details?.collectionIndex] - 1
                              : levelInfo.collectionIds?.[
                                  details?.collectionIndex
                                ]?.collectionMetadata?.images?.length;

                          arr[mainIndex][levelInfo.level] = {
                            ...arr[mainIndex][levelInfo.level],
                            imageIndex: images,
                          };

                          return arr;
                        })
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
                        setDetails((prev) => {
                          const arr = [...prev];
                          const images = [
                            ...arr[mainIndex][levelInfo.level]?.imageIndex,
                          ];

                          images[details?.collectionIndex] =
                            images[details?.collectionIndex] + 1 <=
                            levelInfo.collectionIds?.[details?.collectionIndex]
                              ?.collectionMetadata?.images?.length
                              ? images[details?.collectionIndex] + 1
                              : 0;

                          arr[mainIndex][levelInfo.level] = {
                            ...arr[mainIndex][levelInfo.level],
                            imageIndex: images,
                          };

                          return arr;
                        })
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
              )}
            </div>
          </div>
        )}
        <div className="relative flex items-center text-center justify-center w-fit text-sm font-net break-words">
          {
            levelInfo?.collectionIds?.[details?.collectionIndex]
              ?.collectionMetadata?.title
          }
        </div>
        <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
          <div className="relative flex justify-start items-center">Sizes</div>
          <div className="relative flex flex-row gap-1 items-center justify-center">
            {levelInfo?.collectionIds?.[
              details?.collectionIndex
            ]?.collectionMetadata?.sizes?.map(
              (value: string, indexThree: number) => {
                return (
                  <div
                    key={indexThree}
                    className={`relative ${
                      levelInfo?.collectionIds?.[details?.collectionIndex]
                        ?.printType !== PrintType.Shirt &&
                      levelInfo?.collectionIds?.[details?.collectionIndex]
                        ?.printType !== PrintType.Hoodie
                        ? "w-fit h-fit rounded-sm"
                        : "w-6 h-6 rounded-full border-black"
                    } p-1 flex items-center justify-center text-white text-center text-super bg-mar border-black uppercase  ${`cursor-pointer ${
                      details?.sizeIndex?.[details?.collectionIndex] ===
                      indexThree
                        ? "border-2"
                        : "border"
                    }`}
                  }`}
                    onClick={() =>
                      setDetails((prev) => {
                        let arr = [...prev];
                        let obj = {
                          ...arr[mainIndex][levelInfo.level],
                        };

                        const sizes = [...obj.sizeIndex];
                        sizes[details?.collectionIndex] = indexThree;

                        obj.sizeIndex = sizes;
                        arr[mainIndex][levelInfo.level] = obj;
                        return arr;
                      })
                    }
                  >
                    {value}
                  </div>
                );
              }
            )}
          </div>
        </div>
        {levelInfo?.collectionIds?.[details?.collectionIndex]?.printType !==
          PrintType.Poster &&
          levelInfo?.collectionIds?.[details?.collectionIndex]?.printType !==
            PrintType.Sticker && (
            <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
              <div className="relative flex justify-start items-center">
                Base Colors
              </div>
              <div className="relative flex flex-row gap-1 items-center justify-center">
                {levelInfo?.collectionIds?.[
                  details?.collectionIndex
                ]?.collectionMetadata?.colors?.map(
                  (item: string, indexThree: number) => {
                    return (
                      <div
                        key={indexThree}
                        className={`relative w-5 h-5 rounded-full border cursor-pointer border-black active:scale-95 ${
                          details?.colorIndex?.[details.collectionIndex] ===
                          indexThree
                            ? "border-2"
                            : "border"
                        }`}
                        onClick={() =>
                          setDetails((prev) => {
                            let arr = [...prev];
                            let obj = {
                              ...arr[mainIndex][levelInfo.level],
                            };

                            const colors = [...obj.colorIndex];
                            colors[details?.collectionIndex] = indexThree;

                            obj.colorIndex = colors;
                            arr[mainIndex][levelInfo.level] = obj;
                            return arr;
                          })
                        }
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
        {!cart && (
          <Splits
            price={Number(
              levelInfo.collectionIds?.[details?.collectionIndex]?.prices?.[
                levelInfo.collectionIds?.[details?.collectionIndex]?.prices
                  .length > 1
                  ? details?.sizeIndex?.[details?.collectionIndex]
                  : 0
              ]
            )}
            fPercent={Number(
              levelInfo.collectionIds?.[details?.collectionIndex]
                ?.fulfillerPercent
            )}
            fBase={Number(
              levelInfo.collectionIds?.[details?.collectionIndex]?.fulfillerBase
            )}
            dPercent={Number(
              levelInfo.collectionIds?.[details?.collectionIndex]
                ?.designerPercent
            )}
          />
        )}
        <PurchaseTokens
          details={details}
          setDetails={setDetails}
          mainIndex={mainIndex}
          levelIndex={levelInfo.level}
          tokens={
            levelInfo?.collectionIds?.[details?.collectionIndex]?.acceptedTokens
          }
        />
        <div className="relative flex justify-center items-center font-dog text-black text-xxs">
          {`${Number(
            (
              Number(
                levelInfo.collectionIds?.[details?.collectionIndex]?.prices?.[
                  levelInfo.collectionIds?.[details?.collectionIndex]?.prices
                    .length > 1
                    ? details?.sizeIndex?.[details?.collectionIndex]
                    : 0
                ]
              ) /
              Number(
                oracleData?.find(
                  (or) =>
                    or?.currency?.toLowerCase() ==
                    details?.currency?.toLowerCase()
                )?.rate
              )
            )?.toFixed(2)
          )} ${
            ACCEPTED_TOKENS_MUMBAI?.find((i) => i[2] == details?.currency)?.[1]
          }`}
        </div>
        {cart && (
          <div
            className={`w-40 h-8 cursor-pointer rounded-sm cursor-pointer active:scale-95 border border-black flex items-center justify-center text-center font-gam text-xl ${
              !cartItems?.some(
                (item) =>
                  item.chosenLevel.level === levelInfo.level &&
                  grant?.publication?.id == item?.grant?.publication?.id
              )
                ? "bg-lima"
                : "bg-viol"
            }`}
            onClick={() => {
              if (
                cartItems?.some(
                  (item) =>
                    item.chosenLevel.level === levelInfo.level &&
                    grant?.publication?.id == item?.grant?.publication?.id
                )
              ) {
                router!.push("/checkout");
              } else {
                const itemIndex = cartItems!.findIndex(
                  (cartItem) =>
                    cartItem?.grant?.grantId === grant?.publication?.id
                );
                const newItem = {
                  grant: grant!,
                  chosenLevel: levelInfo,
                  amount: 1,
                  sizes: details?.sizeIndex,
                  colors: details?.colorIndex,
                };
                if (itemIndex !== -1) {
                  const newCartItems = [...(cartItems || [])];
                  newCartItems.splice(itemIndex, 1);
                  dispatch!(setCartItems([...newCartItems, newItem]));
                } else {
                  dispatch!(setCartItems([...(cartItems || []), newItem]));
                }
              }
              dispatch!(setCartAnim(true));
            }}
          >
            <div
              className={`relative w-fit h-fit flex items-center justify-center`}
            >
              {cartItems?.some(
                (item) =>
                  item.chosenLevel.level === levelInfo.level &&
                  grant?.publication?.id == item?.grant?.publication?.id
              )
                ? "Go to Cart"
                : "Choose Level"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectItem;
