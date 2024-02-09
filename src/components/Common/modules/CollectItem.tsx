import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { CollectItemProps, PrintType } from "../../Launch/types/launch.types";
import PurchaseTokens from "@/components/Common/modules/PurchaseTokens";
import Splits from "../../Launch/modules/Splits";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";

const CollectItem: FunctionComponent<CollectItemProps> = ({
  index,
  levelInfo,
  levelsLoading,
  handleChangeCurrency,
  handleChangeImage,
  handleChangeItem,
  cart,
  handleCheckout,
  dispatch,
  cartItems,
  grant,
  router,
  simpleCollectLoading,
}): JSX.Element => {
  const total = index?.price?.[index?.priceIndex] / 10 ** 18;
  const fulfillerShare =
    levelInfo?.collectionIds?.[index?.itemIndex]?.fulfillerPercent *
      (total - levelInfo?.collectionIds?.[index?.itemIndex]?.fulfillerBase) +
    levelInfo?.collectionIds?.[index?.itemIndex]?.fulfillerBase;
  const designerShare =
    levelInfo?.collectionIds?.[index?.itemIndex]?.designerPercent *
    (total - levelInfo?.collectionIds?.[index?.itemIndex]?.fulfillerBase);
  const granteeShare = total - designerShare - fulfillerShare;

  return (
    <div className="relative w-72 h-full flex flex-col items-center justify-start">
      <Bar title={`Collect Lvl.${index?.levelIndex + 1}`} />
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
                    handleChangeItem(
                      index.levelIndex,
                      index.itemIndex < levelInfo?.collectionIds.length - 1
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
                        : levelInfo?.collectionIds.length - 1
                    )
                  }
                >
                  {`>>>`}
                </div>
              </div>
            )}
            <div className="relative w-52 h-52 rounded-sm border border-black flex items-center justify-center">
              {levelInfo?.collectionIds?.[
                index?.itemIndex
              ]?.collectionMetadata?.images?.[index?.imageIndex]?.split(
                "ipfs://"
              )[1] && (
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${
                    levelInfo?.collectionIds?.[
                      index.itemIndex
                    ]?.collectionMetadata?.images?.[index?.imageIndex]?.split(
                      "ipfs://"
                    )[1]
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
                          levelInfo?.collectionIds[index.itemIndex]
                            ?.collectionMetadata.images.length -
                            1
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
                          : levelInfo?.collectionIds[index.itemIndex]
                              ?.collectionMetadata.images.length - 1
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
          {
            levelInfo?.collectionIds?.[index?.itemIndex]?.collectionMetadata
              ?.title
          }
        </div>
        <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
          <div className="relative flex justify-start items-center">Sizes</div>
          <div className="relative flex flex-row gap-1 items-center justify-center">
            {levelInfo?.collectionIds?.[
              index?.itemIndex
            ]?.collectionMetadata?.sizes?.map(
              (value: string, indexThree: number) => {
                return (
                  <div
                    key={indexThree}
                    className={`relative ${
                      levelInfo?.collectionIds?.[index.itemIndex]?.printType !==
                        PrintType.Shirt &&
                      levelInfo?.collectionIds?.[index.itemIndex]?.printType !==
                        PrintType.Hoodie
                        ? "w-fit h-fit rounded-sm"
                        : "w-6 h-6 rounded-full border-black"
                    } p-1 flex items-center justify-center text-white text-center text-super bg-mar border uppercase  ${
                      levelInfo?.collectionIds?.[index?.itemIndex]
                        ?.printType !== PrintType.Shirt &&
                      levelInfo?.collectionIds?.[index?.itemIndex]
                        ?.printType !== PrintType.Hoodie &&
                      `cursor-pointer ${
                        index?.priceIndex === indexThree
                          ? "border-white"
                          : "border-black"
                      }`
                    }
                  }`}
                    onClick={() =>
                      handleChangeCurrency(
                        index.levelIndex,
                        levelInfo?.collectionIds[index.itemIndex]?.printType ===
                          PrintType.Shirt ||
                          levelInfo?.collectionIds[index.itemIndex]
                            ?.printType === PrintType.Hoodie
                          ? 0
                          : indexThree,
                        index.currency,
                        Number(
                          levelInfo?.collectionIds[index.itemIndex]?.prices[
                            levelInfo?.collectionIds[index.itemIndex]
                              ?.printType === PrintType.Shirt ||
                            levelInfo?.collectionIds[index.itemIndex]
                              ?.printType === PrintType.Hoodie
                              ? 0
                              : indexThree
                          ]
                        )
                      )
                    }
                  >
                    {value}
                  </div>
                );
              }
            )}
          </div>
        </div>
        {levelInfo?.collectionIds?.[index?.itemIndex]?.printType !==
          PrintType.Poster &&
          levelInfo?.collectionIds?.[index?.itemIndex]?.printType !==
            PrintType.Sticker && (
            <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
              <div className="relative flex justify-start items-center">
                Base Colors
              </div>
              <div className="relative flex flex-row gap-1 items-center justify-center">
                {levelInfo?.collectionIds?.[
                  index?.itemIndex
                ]?.collectionMetadata?.colors?.map(
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
        {!cart && (
          <Splits
            grantee={Number(((granteeShare / total) * 100).toFixed(2))}
            designer={Number(((designerShare / total) * 100).toFixed(2))}
            fulfiller={Number(((fulfillerShare / total) * 100).toFixed(2))}
          />
        )}
        <PurchaseTokens
          levelIndex={index?.levelIndex}
          currency={index?.currency}
          handleChangeCurrency={handleChangeCurrency}
          itemIndex={index?.itemIndex}
          priceIndex={index?.priceIndex}
        />
        <div className="relative flex justify-center items-center font-dog text-black text-xxs">
          {`${Number(
            (index?.price?.[index.priceIndex] / index?.rate)?.toFixed(2)
          )} ${index?.currency}`}
        </div>
        {cart && (
          <div
            className={`w-40 h-8 cursor-pointer rounded-sm cursor-pointer active:scale-95 border border-black flex items-center justify-center text-center font-gam text-xl ${
              !cartItems?.some(
                (item) =>
                item.chosenLevel.level === levelInfo.level &&
                id == item.grant.publication?.id
              )
                ? "bg-lima"
                : "bg-viol"
            }`}
            onClick={() => {
            
              if (index?.levelIndex == 0) {
                handleCheckout!({
                  grant: ,
                  sizes: ,
                  colors: ,
                  chosenLevel: ,
                  amount: 1
                });
                return;
              }

              if (
                cartItems?.some(
                  (item) =>
                  item.chosenLevel.level === levelInfo.level &&
                  id == item.grant.publication?.id
                )
              ) {
                router!.push("/checkout");
              } else {
                const itemIndex = cartItems!.findIndex(
                  (cartItem) => cartItem?.collectionId === id
                );
                if (cartItems?.some((item) => item.collectionId === id)) {
                  const newCartItems = [...cartItems];
                  newCartItems.splice(itemIndex, 1);
                  dispatch!(setCartItems([...newCartItems, newItem]));
                } else {
                  dispatch!(setCartItems([...cartItems!, newItem]));
                }
              }
              dispatch!(setCartAnim(true));
            }}
          >
            <div
              className={`relative w-fit h-fit flex items-center justify-center ${
                simpleCollectLoading && index.levelIndex == 0 && "animate-spin"
              }`}
            >
              {simpleCollectLoading && index.levelIndex == 0 ? (
                <AiOutlineLoading color={"black"} size={15} />
              ) : cartItems?.some(
                  (item) =>
                    item.chosenLevel.level === levelInfo.level &&
                    id == item.grant.publication?.id
                ) ? (
                "Go to Cart"
              ) : (
                "Choose Level"
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectItem;
