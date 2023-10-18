import { FunctionComponent } from "react";
import { CollectItemProps } from "../types/grant.types";
import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import {
  APPAREL_SIZE,
  INFURA_GATEWAY,
  POSTER_SIZE,
  STICKER_SIZE,
} from "../../../../lib/constants";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";
import { PrintItem, PrintType } from "@/components/Launch/types/launch.types";

const CollectItem: FunctionComponent<CollectItemProps> = ({
  index,
  collectChoice,
  setCollectChoice,
  cartItems,
  dispatch,
  id,
  items,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-60 h-fit flex flex-col">
      <Bar title={`Collect Lvl.${index}`} />
      {items.map((item: PrintItem, indexTwo: number) => {
        return (
          <div
            key={indexTwo}
            className="relative w-full h-fit flex flex-col bg-offWhite gap-6 justify-start items-center p-2 border-b border-x rounded-b-sm border-black"
          >
            <div className="relative w-full h-44 rounded-sm border border-black flex">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/`}
                draggable={false}
              />
            </div>
            <div className="relative w-fit h-fit flex flex-col gap-3 items-center justify-center text-center break-words">
              <div className="relative flex items-center items-center justify-center w-fit text-3xl font-net">
                {item?.uri?.title}
              </div>
              <div className="relative flex items-start justify-center w-full h-24 overflow-y-scroll text-xs font-vcr">
                {item?.uri?.description}
              </div>
            </div>
            <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
              <div className="relative flex justify-start items-center">
                Choose Size
              </div>
              <div className="relative flex flex-row gap-1 items-center justify-center">
                {(item?.printType === PrintType.Sticker
                  ? STICKER_SIZE
                  : item?.printType === (PrintType.Hoodie || PrintType.Shirt)
                  ? APPAREL_SIZE
                  : POSTER_SIZE
                ).map((item: string, indexTwo: number) => {
                  return (
                    <div
                      key={indexTwo}
                      className={`relative w-fit h-fit p-1 flex items-center justify-center text-white text-center text-xxs rounded-sm bg-mar cursor-pointer ${
                        collectChoice[index - 1].size === item
                          ? "border-viol border-2"
                          : "border-black border"
                      }`}
                      onClick={() => {
                        const choices = [...collectChoice];
                        choices[index - 1].size =
                          choices[index - 1].size === item ? "" : item;
                        setCollectChoice(choices);
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
            {item?.printType === (PrintType.Hoodie || PrintType.Shirt) && (
              <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
                <div className="relative flex justify-start items-center">
                  Choose Base Color
                </div>
                <div className="relative flex flex-row gap-1 items-center justify-center">
                  {["#000000", "#FFFFFF", "#97D1FD", "#F66054"].map(
                    (item: string, indexTwo: number) => {
                      return (
                        <div
                          key={indexTwo}
                          className={`relative w-5 h-5 cursor-pointer rounded-full ${
                            collectChoice[index - 1].color === item
                              ? "border-viol border-2"
                              : "border-black border"
                          }`}
                          style={{
                            backgroundColor: item,
                          }}
                          onClick={() => {
                            const choices = [...collectChoice];
                            choices[index - 1].color =
                              choices[index - 1].color === item ? "" : item;
                            setCollectChoice(choices);
                          }}
                        ></div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
            <div className="relative flex flex-col gap-1.5 justify-start items-center font-dog text-black text-xs">
              <div className="relative flex justify-start items-center">
                Amount
              </div>
              <div className="relative flex justify-start items-center">
                $ {item?.prices}
              </div>
            </div>
            <div
              className={`w-40 h-8 cursor-pointer rounded-sm cursor-pointer active:scale-95 border border-black flex items-center justify-center text-center font-gam text-xl ${
                !cartItems?.some(
                  (item) => item.id === id && item.level === index
                )
                  ? "bg-lima"
                  : "bg-viol"
              }`}
              onClick={() => {
                const newItem = {
                  ...collectChoice[index - 1],
                  id: id,
                  amount: item?.prices,
                  level: index,
                };

                if (
                  cartItems?.some(
                    (item) => item.id === id && item.level === index
                  )
                ) {
                  router.push("/checkout");
                } else {
                  const itemIndex = cartItems.findIndex(
                    (cartItem) => cartItem.id === id
                  );
                  if (cartItems?.some((item) => item.id === id)) {
                    const newCartItems = [...cartItems];
                    newCartItems.splice(itemIndex, 1);
                    dispatch(setCartItems([...newCartItems, newItem]));
                  } else {
                    dispatch(setCartItems([...cartItems, newItem]));
                  }
                }
                dispatch(setCartAnim(true));
              }}
            >
              {cartItems?.some((item) => item.id === id && item.level === index)
                ? "Go to Cart"
                : "Choose Level"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CollectItem;
