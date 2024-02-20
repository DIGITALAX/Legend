import useCheckout from "@/components/Checkout/hooks/useCheckout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Fulfillment from "@/components/Checkout/modules/Fulfillment";
import { useAccount } from "wagmi";
import { NextRouter } from "next/router";
import { createPublicClient, http } from "viem";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { polygonMumbai } from "viem/chains";
import { CartItem } from "@/components/Checkout/types/checkout.types";
import PurchaseTokens from "@/components/Common/modules/PurchaseTokens";
import { ACCEPTED_TOKENS_MUMBAI, INFURA_GATEWAY } from "../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { setCartItems } from "../../redux/reducers/cartItemsSlice";
import { PrintItem, PrintType } from "@/components/Launch/types/launch.types";
import Image from "next/legacy/image";

export default function Checkout({
  router,
  client,
}: {
  router: NextRouter;
  client: LitNodeClient;
}) {
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI}`
    ),
  });
  const dispatch = useDispatch();
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const {
    handleCheckout,
    approvePurchase,
    checkoutApproved,
    checkoutLoading,
    fulfillment,
    setFulfillment,
    setChosenCartItem,
    chosenCartItem,
    currency,
    setCurrency,
  } = useCheckout(
    cartItems,
    client,
    address,
    dispatch,
    publicClient,
    lensConnected,
    oracleData,
    router
  );
  return (
    <div
      className="relative w-full h-full flex px-2 py-5 lg:px-5 items-start justify-center overflow-y-scroll"
      id="side"
    >
      <div
        className="relative flex flex-col tablet:flex-row items-center justify-start tablet:items-start tablet:justify-center gap-7 lg:gap-10 w-full xl:w-4/5 h-fit overflow-y-scroll"
        id="side"
      >
        <div className="relative w-full tablet:w-fit h-fit flex flex-col items-start justify-start gap-3">
          <Fulfillment
            fulfillment={fulfillment}
            setFulfillment={setFulfillment}
            fulfillmentLoading={checkoutLoading}
          />
          {cartItems?.length > 0 && (
            <div className="relative rounded-sm w-full h-fit py-2 px-1 items-center justify-between flex flex-row bg-black border border-lima text-lima font-dog text-xxs">
              <div className="relative w-fit h-fit flex items-center justify-center">
                Cart Total:
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">{`${Number(
                Number(
                  cartItems?.reduce(
                    (totalAcc, item) =>
                      totalAcc +
                      item?.chosenLevel?.collectionIds?.reduce(
                        (collectionAcc, collection, index) =>
                          collectionAcc +
                          Number(
                            collection?.prices[
                              collection?.printType !== PrintType.Sticker &&
                              collection?.printType !== PrintType.Poster
                                ? 0
                                : item?.sizes?.[index]
                            ] || 0
                          ),
                        0
                      ),
                    0
                  )
                ) /
                  Number(
                    oracleData?.find(
                      (or) =>
                        or?.currency?.toLowerCase() == currency?.toLowerCase()
                    )?.rate
                  )
              )?.toFixed(4)} ${
                ACCEPTED_TOKENS_MUMBAI?.find((i) => i[2] == currency)?.[1]
              }`}</div>
            </div>
          )}
          {cartItems?.length > 0 && (
            <div className="relative rounded-sm w-full h-fit p-1 items-center justify-between flex flex-row bg-mar/75 border border-lima">
              <div className="relative w-fit h-fit flex items-center justify-start">
                <PurchaseTokens
                  details={currency}
                  main
                  mainIndex={0}
                  tokens={chosenCartItem?.grant?.acceptedCurrencies!}
                  levelIndex={0}
                  setDetails={setCurrency}
                />
              </div>
              <div className="relative flex justify-center items-center font-dog text-lima text-xxs w-fit h-fit">
                {`${Number(
                  (
                    Number(
                      chosenCartItem?.chosenLevel?.collectionIds?.reduce(
                        (acc, val, index) =>
                          acc +
                          Number(
                            val.prices?.[
                              val?.printType !== PrintType.Sticker &&
                              val?.printType !== PrintType.Poster
                                ? 0
                                : chosenCartItem?.sizes?.[index]
                            ] || 0
                          ),
                        0
                      )
                    ) /
                    Number(
                      oracleData?.find(
                        (or) =>
                          or?.currency?.toLowerCase() == currency?.toLowerCase()
                      )?.rate
                    )
                  )?.toFixed(5)
                )} ${
                  ACCEPTED_TOKENS_MUMBAI?.find((i) => i[2] == currency)?.[1]
                }`}
              </div>
            </div>
          )}
          <div
            className={`relative rounded-sm w-full h-10 py-2 px-1 items-center justify-center font-dog text-sm flex flex-row bg-lima border border-mar/75 text-mar/75  ${
              !checkoutLoading && cartItems?.length > 0 && "cursor-pointer"
            }`}
            onClick={() =>
              !checkoutLoading &&
              cartItems?.length > 0 &&
              chosenCartItem &&
              (!checkoutApproved
                ? approvePurchase(chosenCartItem!, currency)
                : handleCheckout(chosenCartItem!, currency))
            }
          >
            <div
              className={`relative w-fit h-fit flex items-center justify-center ${
                checkoutLoading && "animate-spin"
              }`}
            >
              {cartItems?.length < 1 ? (
                "ADD ITEMS TO CART"
              ) : checkoutLoading ? (
                <AiOutlineLoading color="black" size={12} />
              ) : !checkoutApproved ? (
                "APPROVE TOKEN"
              ) : (
                "CHECKOUT"
              )}
            </div>
          </div>
        </div>
        <div
          className="relative flex overflow-y-scroll items-start justify-start w-full h-[80rem] tablet:h-full"
          id="side"
        >
          <div className="relative w-full h-fit flex flex-col items-center justify-start gap-8">
            {cartItems?.map((item: CartItem, index: number) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-fit flex flex-col gap-3 items-center justify-center"
                >
                  <div
                    className={`relative rounded-sm w-full h-fit py-2 px-1 items-center justify-between flex flex-row bg-black border font-dog text-xxs text-lima cursor-pointer ${
                      chosenCartItem?.chosenLevel == item?.chosenLevel &&
                      chosenCartItem?.grant?.grantId == item?.grant?.grantId &&
                      JSON.stringify(item?.colors?.flat()) ===
                        JSON.stringify(chosenCartItem?.colors?.flat()) &&
                      JSON.stringify(item?.sizes?.flat()) ===
                        JSON.stringify(chosenCartItem?.sizes?.flat())
                        ? "border-viol"
                        : "border-lima"
                    }`}
                    onClick={() => setChosenCartItem(item)}
                  >
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      {`(Lvl. ${Number(item.chosenLevel.level)})  ${
                        item.grant.grantMetadata.title
                      }`}
                    </div>
                    <div className="relative gap-2 w-fit h-fit  flex flex-row items-center justify-center">
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        x{item.amount}
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center flex-row font-dog text-super text-white">
                        <div
                          className="relative w-5 h-4 flex cursor-pointer items-center justify-center active:scale-95 border-y border-l border-lima"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const newItems = cartItems.map((value) => {
                              if (
                                value.grant.grantId == item.grant.grantId &&
                                Number(value.chosenLevel.level) ==
                                  Number(item.chosenLevel.level) &&
                                JSON.stringify(value?.colors?.flat()) ===
                                  JSON.stringify(item?.colors?.flat()) &&
                                JSON.stringify(value?.sizes?.flat()) ===
                                  JSON.stringify(item?.sizes?.flat())
                              ) {
                                return {
                                  ...value,
                                  amount: value.amount + 1,
                                };
                              } else {
                                return value;
                              }
                            });

                            dispatch(setCartItems(newItems));
                          }}
                        >
                          +
                        </div>
                        <div
                          className="relative w-5 h-4 flex cursor-pointer items-center justify-center active:scale-95 border border-lima"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const newItems = cartItems
                              .map((value) => {
                                if (
                                  value.grant.grantId == item.grant.grantId &&
                                  Number(value.chosenLevel.level) ==
                                    Number(item.chosenLevel.level) &&
                                  JSON.stringify(value?.colors?.flat()) ===
                                    JSON.stringify(item?.colors?.flat()) &&
                                  JSON.stringify(value?.sizes?.flat()) ===
                                    JSON.stringify(item?.sizes?.flat())
                                ) {
                                  return value.amount - 1 != 0
                                    ? {
                                        ...value,
                                        amount: value.amount - 1,
                                      }
                                    : undefined;
                                } else {
                                  return value;
                                }
                              })
                              .filter(Boolean);
                            dispatch(setCartItems(newItems as CartItem[]));
                          }}
                        >
                          -
                        </div>
                      </div>
                      <div
                        className="relative w-fit h-fit flex items-center justify-center cursor-pointer active:scale-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const newItems = cartItems
                            .filter((value) => {
                              if (
                                value.grant.grantId == item.grant.grantId &&
                                Number(value.chosenLevel.level) ==
                                  Number(item.chosenLevel.level) &&
                                JSON.stringify(value?.colors?.flat()) ===
                                  JSON.stringify(item?.colors?.flat()) &&
                                JSON.stringify(value?.sizes?.flat()) ===
                                  JSON.stringify(item?.sizes?.flat())
                              ) {
                                return undefined;
                              } else {
                                return value;
                              }
                            })
                            .filter(Boolean);

                          dispatch(setCartItems(newItems));
                        }}
                      >
                        <ImCross size={10} color="#CAED00" />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`relative w-full h-fit flex items-start justify-start bg-mar/75 border font-dog text-super sm:text-xxs text-lima flex-col p-2 gap-4 max-h-[20rem] overflow-y-scroll ${
                      chosenCartItem?.chosenLevel == item?.chosenLevel &&
                      chosenCartItem?.grant?.grantId == item?.grant?.grantId &&
                      JSON.stringify(item?.colors?.flat()) ===
                        JSON.stringify(chosenCartItem?.colors?.flat()) &&
                      JSON.stringify(item?.sizes?.flat()) ===
                        JSON.stringify(chosenCartItem?.sizes?.flat())
                        ? "border-viol"
                        : "border-lima"
                    }`}
                    id="side"
                  >
                    {item?.chosenLevel?.collectionIds?.map(
                      (coll: PrintItem, indexTwo: number) => {
                        return (
                          <div
                            className="relative w-full h-fit flex items-center justify-between sm:flex-nowrap flex-wrap flex-row gap-6 sm:gap-2"
                            key={indexTwo}
                          >
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              <div className="relative w-20 h-20 flex items-center justify-center rounded-sm border border-lima">
                                <Image
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-sm"
                                  draggable={false}
                                  src={`${INFURA_GATEWAY}/ipfs/${
                                    coll?.collectionMetadata?.images?.[0]?.split(
                                      "ipfs://"
                                    )?.[1]
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="relative flex items-center justify-center w-fit h-fit">
                              {coll?.collectionMetadata?.title}
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-2">
                              <div className="relative w-fit h-fit flex items-center justify-center">
                                <div
                                  className="w-5 h-5 flex items-center justify-center rounded-full border border-lima"
                                  style={{
                                    backgroundColor:
                                      coll?.collectionMetadata?.colors?.[
                                        item?.colors?.[indexTwo]
                                      ],
                                  }}
                                ></div>
                              </div>
                              <div className="relative w-fit h-fit flex items-center justify-center">
                                <div
                                  className={`flex items-center justify-center w-fit h-fit font-dog text-super`}
                                >
                                  {
                                    coll?.collectionMetadata?.sizes?.[
                                      item?.sizes?.[indexTwo]
                                    ]
                                  }
                                </div>
                              </div>
                            </div>
                            <div>
                              {
                                ACCEPTED_TOKENS_MUMBAI?.find(
                                  (i) => i[2] == currency
                                )?.[1]
                              }{" "}
                              {(
                                Number(
                                  coll?.prices?.[
                                    coll?.printType !== PrintType.Sticker &&
                                    coll?.printType !== PrintType.Poster
                                      ? 0
                                      : item?.sizes?.[indexTwo]
                                  ]
                                ) /
                                Number(
                                  oracleData?.find(
                                    (oracle) => oracle.currency === currency
                                  )?.rate
                                )
                              )?.toFixed(4)}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
