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
import { setMediaExpand } from "../../../../redux/reducers/mediaExpandSlice";

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
      <Bar title={`Collect Lvl.${Number(levelInfo.level)}`} />
      <div className="relative w-full h-110 flex flex-col gap-2 justify-between items-center p-2 border-b border-x rounded-b-sm border-black bg-white">
        {levelsLoading ? (
          <div className="relative w-48 h-48 rounded-sm border border-black flex items-center justify-center">
            <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
              <AiOutlineLoading size={15} color="black" />
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col gap-2 w-full h-fit items-center justify-center">
            {levelInfo?.collectionIds?.length > 1 && (
              <div className="relative w-full h-fit flex items-center justify-center flex-row gap-1.5 text-super text-lima font-dog">
                <div
                  className={`relative w-fit h-6 items-center px-1.5 justify-center flex bg-mar/70 border border-lima rounded-md cursor-pointer active:scale-95`}
                  onClick={() =>
                    setDetails((prev) => {
                      const arr = [...prev];
                      arr[mainIndex][Number(levelInfo.level) - 1] = {
                        ...arr[mainIndex][Number(levelInfo.level) - 1],
                        collectionIndex:
                          arr[mainIndex][levelInfo?.level - 1]
                            ?.collectionIndex -
                            1 >=
                          0
                            ? arr[mainIndex][levelInfo?.level - 1]
                                ?.collectionIndex - 1
                            : levelInfo.collectionIds.length - 1,
                      };

                      return arr;
                    })
                  }
                >
                  {`<<<`}
                </div>
                <div
                  className={`relative w-fit h-6 items-center px-1.5 justify-center flex bg-mar/70 border border-lima rounded-md cursor-pointer active:scale-95`}
                  onClick={() =>
                    setDetails((prev) => {
                      const arr = [...prev];
                      arr[mainIndex][Number(levelInfo.level) - 1] = {
                        ...arr[mainIndex][Number(levelInfo.level) - 1],
                        collectionIndex:
                          arr[mainIndex][levelInfo?.level - 1]
                            ?.collectionIndex +
                            1 <
                          levelInfo.collectionIds.length
                            ? arr[mainIndex][levelInfo?.level - 1]
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
            <div className="relative w-fit h-fit flex items-center justify-center gap-3 flex-col">
              <div
                className="relative w-52 h-52 rounded-sm border border-black flex items-center bg-mar/70 justify-center cursor-pointer"
                onClick={() =>
                  dispatch(
                    setMediaExpand({
                      actionType: "image",
                      actionValue: true,
                      actionMedia: `${INFURA_GATEWAY}/ipfs/${
                        levelInfo?.collectionIds?.[
                          details?.collectionIndex
                        ]?.collectionMetadata?.images?.[
                          details?.imageIndex?.[details?.collectionIndex] || 0
                        ]?.split("ipfs://")[1]
                      }`,
                    })
                  )
                }
              >
                {levelInfo?.collectionIds?.[
                  details?.collectionIndex
                ]?.collectionMetadata?.images?.[
                  details?.imageIndex?.[details.collectionIndex] || 0
                ]?.split("ipfs://")[1] && (
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/${
                      levelInfo?.collectionIds?.[
                        details?.collectionIndex
                      ]?.collectionMetadata?.images?.[
                        details?.imageIndex?.[details?.collectionIndex] || 0
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
                              ...arr[mainIndex][Number(levelInfo.level) - 1]
                                ?.imageIndex,
                            ];

                            images[details?.collectionIndex] =
                              images[details?.collectionIndex] - 1 >= 0
                                ? images[details?.collectionIndex] - 1
                                : levelInfo.collectionIds?.[
                                    details?.collectionIndex
                                  ]?.collectionMetadata?.images?.length;

                            arr[mainIndex][Number(levelInfo.level) - 1] = {
                              ...arr[mainIndex][Number(levelInfo.level) - 1],
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

                    <div className="relative w-fit h-fit flex items-center justify-center p-1">
                      <div
                        className="relative w-2 h-2 flex items-center justify-center rotate-180 cursor-pointer active:scale-95"
                        onClick={() =>
                          setDetails((prev) => {
                            const arr = [...prev];
                            const images = [
                              ...arr[mainIndex][Number(levelInfo.level) - 1]
                                ?.imageIndex,
                            ];

                            images[details?.collectionIndex] =
                              images[details?.collectionIndex] + 1 <=
                              levelInfo.collectionIds?.[
                                details?.collectionIndex
                              ]?.collectionMetadata?.images?.length
                                ? images[details?.collectionIndex] + 1
                                : 0;

                            arr[mainIndex][Number(levelInfo.level) - 1] = {
                              ...arr[mainIndex][Number(levelInfo.level) - 1],
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
              <div className="relative flex items-center text-center justify-center w-fit text-sm font-net break-words">
                {
                  levelInfo?.collectionIds?.[details?.collectionIndex]
                    ?.collectionMetadata?.title
                }
              </div>
            </div>
          </div>
        )}

        <div className="relative flex flex-col w-full h-fit flex items-center justify-center gap-5">
          <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
            <div className="relative flex justify-start items-center">
              Sizes
            </div>
            <div className="relative flex flex-wrap gap-1 items-center justify-center">
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
                          ? "w-fit h-fit rounded-sm text-size"
                          : "w-7 h-7 rounded-full border-black text-super"
                      } flex items-center justify-center text-white text-center bg-mar/70 border-lima uppercase ${`cursor-pointer ${
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
                            ...arr[mainIndex][Number(levelInfo.level) - 1],
                          };

                          const sizes = [...obj.sizeIndex];
                          sizes[details?.collectionIndex] = indexThree;

                          obj.sizeIndex = sizes;
                          arr[mainIndex][Number(levelInfo.level) - 1] = obj;
                          return arr;
                        })
                      }
                    >
                      <div
                        className={`relative w-fit h-fit flex items-center justify-center ${
                          levelInfo?.collectionIds?.[details?.collectionIndex]
                            ?.printType !== PrintType.Shirt &&
                          levelInfo?.collectionIds?.[details?.collectionIndex]
                            ?.printType !== PrintType.Hoodie
                            ? "py-2 px-1"
                            : "p-px"
                        }`}
                      >
                        {value}
                      </div>
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
                <div className="relative flex flex-wrap gap-1 items-center justify-center">
                  {levelInfo?.collectionIds?.[
                    details?.collectionIndex
                  ]?.collectionMetadata?.colors?.map(
                    (item: string, indexThree: number) => {
                      return (
                        <div
                          key={indexThree}
                          className={`relative w-5 h-5 rounded-full border cursor-pointer border-lima active:scale-95 ${
                            details?.colorIndex?.[details.collectionIndex] ===
                            indexThree
                              ? "border-2"
                              : "border"
                          }`}
                          onClick={() =>
                            setDetails((prev) => {
                              let arr = [...prev];
                              let obj = {
                                ...arr[mainIndex][Number(levelInfo.level) - 1],
                              };

                              const colors = [...obj.colorIndex];
                              colors[details?.collectionIndex] = indexThree;

                              obj.colorIndex = colors;
                              arr[mainIndex][Number(levelInfo.level) - 1] = obj;
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
                levelInfo.collectionIds?.[details?.collectionIndex]
                  ?.fulfillerBase
              )}
              dPercent={Number(
                levelInfo.collectionIds?.[details?.collectionIndex]
                  ?.designerPercent
              )}
            />
          )}
        </div>
        <div className="relative mb-0 flex items-center justify-center flex flex-col gap-4 w-full h-fit">
          <div className="relative flex justify-center items-center flex-col gap-1.5 w-full h-fit">
            <div className="relative flex justify-center items-center font-dog text-black text-xxs w-fit h-fit">
              {`${Number(
                (
                  Number(
                    levelInfo.collectionIds?.[details?.collectionIndex]
                      ?.prices?.[
                      levelInfo.collectionIds?.[details?.collectionIndex]
                        ?.prices.length > 1
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
                )?.toFixed(4)
              )} ${
                ACCEPTED_TOKENS_MUMBAI?.find(
                  (i) => i[2] == details?.currency
                )?.[1]
              }`}
            </div>
            <div className="relative w-3/4 h-fit flex items-center justify-center">
              <PurchaseTokens
                details={details}
                setDetails={setDetails}
                mainIndex={mainIndex}
                levelIndex={Number(levelInfo.level) - 1}
                tokens={
                  levelInfo.collectionIds?.[details?.collectionIndex]
                    ?.acceptedTokens
                }
              />
            </div>
          </div>
          {cart && (
            <div
              className={`w-40 h-8 cursor-pointer rounded-sm cursor-pointer active:scale-95 border border-lima flex flex-row gap-3 items-center justify-center text-center font-dog text-super ${
                !cartItems?.some(
                  (item) =>
                    Number(item.chosenLevel.level) ===
                      Number(levelInfo.level) &&
                    grant?.publication?.id == item?.grant?.publication?.id &&
                    JSON.stringify(item?.colors?.flat()) ===
                      JSON.stringify(details?.colorIndex?.flat()) &&
                    JSON.stringify(item?.sizes?.flat()) ===
                      JSON.stringify(details?.sizeIndex?.flat())
                )
                  ? "bg-mar/70 text-lima"
                  : "bg-viol/70 text-white"
              }`}
              onClick={() => {
                if (
                  cartItems?.some(
                    (item) =>
                      Number(item.chosenLevel.level) ===
                        Number(levelInfo.level) &&
                      grant?.publication?.id == item?.grant?.publication?.id &&
                      JSON.stringify(item?.colors?.flat()) ===
                        JSON.stringify(details?.colorIndex?.flat()) &&
                      JSON.stringify(item?.sizes?.flat()) ===
                        JSON.stringify(details?.sizeIndex?.flat())
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
                className={`relative w-fit h-fit flex items-center justify-center uppercase`}
              >
                {cartItems?.some(
                  (item) =>
                    Number(item.chosenLevel.level) ===
                      Number(levelInfo.level) &&
                    grant?.publication?.id == item?.grant?.publication?.id &&
                    JSON.stringify(item?.colors?.flat()) ===
                      JSON.stringify(details?.colorIndex?.flat()) &&
                    JSON.stringify(item?.sizes?.flat()) ===
                      JSON.stringify(details?.sizeIndex?.flat())
                )
                  ? "Go to Cart"
                  : "Choose Level"}
              </div>
              <div className="relative w-4 h-4 flex items-center justify-center">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmNoDqqXhGyz7DcGmFAoXS8z5JPXzkp5CgDDKgecJxDaxw`}
                  draggable={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectItem;
