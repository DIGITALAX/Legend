import { FunctionComponent } from "react";
import { Details, Order, OrdersProps } from "../types/grantee.types";
import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";
import { PrintItem, PrintType } from "@/components/Launch/types/launch.types";

const Orders: FunctionComponent<OrdersProps> = ({
  allOrders,
  ordersLoading,
  orderOpen,
  setOrderOpen,
  orderDecrypting,
  decryptOrder,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-full flex items-start justify-start flex-col overflow-y-scroll"
      id="side"
    >
      {ordersLoading ? (
        <div className="relative w-full h-fit flex flex-col items-center justify-start gap-8">
          {Array.from({ length: 3 })?.map((_, index: number) => {
            return (
              <div
                className="relative h-40 w-3/4 border border-black flex flex-col items-center justify-start bg-black animate-pulse"
                key={index}
              >
                <Bar title={"Loading..."} />
                <div className="relative w-full h-full flex flex-col bg-grant bg-repeat bg-contain"></div>
              </div>
            );
          })}
        </div>
      ) : allOrders?.length < 1 ? (
        <div className="relative w-full h-full flex items-center justify-center text-xxs font-dog text-white">
          <div className="relative w-fit h-fit items-center justify-center">
            No Orders Yet.
          </div>
        </div>
      ) : (
        <div className="relative w-full h-fit flex flex-col justify-start items-center gap-3">
          {allOrders?.map((order: Order, index: number) => {
            return (
              <div
                key={index}
                className={`relative w-full flex flex-col gap-6 border border-white rounded-sm justify-start items-center text-white font-dog text-super h-fit`}
              >
                <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full rounded-sm">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      order?.grant?.grantMetadata?.cover?.split("ipfs://")?.[1]
                    }`}
                    layout="fill"
                    draggable={false}
                    objectFit="cover"
                    className="rounded-sm w-full h-full"
                  />
                  <div className="relative w-full h-full bg-black/70 flex"></div>
                </div>
                <div
                  className="relative w-full h-20 flex sm:flex-nowrap flex-wrap items-center justify-between gap-4 px-2 py-1 cursor-pointer"
                  onClick={() =>
                    setOrderOpen((prev) => {
                      const arr = [...prev];
                      arr[index] = !arr[index];
                      return arr;
                    })
                  }
                >
                  <div className="relative w-fit h-fit flex items-center justify-center">{`${
                    order?.grant?.grantMetadata?.title?.length > 16
                      ? order?.grant?.grantMetadata?.title
                      : order?.grant?.grantMetadata?.title?.slice(0, 16)
                  } ( Lvl. ${order?.level} )`}</div>
                  <div className="relative flex flex-col gap-3 items-center justify-center">
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      {order?.blockTimestamp}
                    </div>
                    <div className="relative w-fit h-fit flex flex-row gap-2 items-center justify-center">
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        {Number((Number(order?.amount) / 10 ** 18)?.toFixed(5))}
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        <div
                          className={`relative w-fit h-fit rounded-full flex items-center`}
                        >
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/${
                              ACCEPTED_TOKENS_MUMBAI?.find(
                                (item) =>
                                  item[2]?.toLowerCase() ==
                                  order?.currency?.toLowerCase()
                              )?.[0]
                            }`}
                            className="flex"
                            draggable={false}
                            width={15}
                            height={17}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {orderOpen[index] && (
                  <div className="relative w-full h-fit flex items-start gap-4 flex-col justify-start pb-2 bg-black/50">
                    <div className="relative w-full h-px bg-white/70 flex"></div>
                    <div className="relative w-full h-fit flex items-start gap-6 flex-col justify-start px-2">
                      <div className="relative justify-center items-center flex flex-row gap-1 w-fit h-fit text-lima">
                        <div className="relative w-fit h-fit flex items-center justify-center text-white">
                          Tx:
                        </div>
                        <Link
                          target="_blank"
                          rel="noreferrer"
                          href={`https://polygonscan.com/tx/${order?.transactionHash}`}
                          className="relative w-fit h-fit flex items-center justify-center cursor-pointer break-all"
                        >
                          {order?.transactionHash?.slice(0, 30) + "..."}
                        </Link>
                      </div>
                      <div className="relative w-full h-fit flex flex-col items-start justify-start text-white gap-6">
                        <div className="relative w-full h-fit flex flex-col items-start justify-start text-white gap-4">
                          <div className="relative w-fit h-fit flex items-start justify-start text-xxs">
                            Order Details
                          </div>
                          <div className="relative flex flex-row items-start justify-between w-full h-fit gap-6">
                            <div className="relative w-fit h-fit flex items-start justify-start flex-row flex-wrap gap-4">
                              {[
                                "Name",
                                "Contact",
                                "Address",
                                "Zip",
                                "City",
                                "State",
                                "Country",
                              ].map((item: string, indexTwo: number) => {
                                return (
                                  <div
                                    key={indexTwo}
                                    className="relative w-fit h-fit flex flex-col items-start justify-start gap-1"
                                  >
                                    <div className="relative w-fit h-fit flex text-lima break-words">
                                      {item}
                                    </div>
                                    <div className="relative w-fit h-fit flex">
                                      {order?.decrypted
                                        ? (order?.encryptedFulfillment as any)
                                            ?.fulfillment?.[item?.toLowerCase()]
                                        : "%$70hg$LeeTdf"}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div
                              className={`relative h-8 w-20 border border-white rounded-sm text-lima flex items-center justify-center ${
                                !orderDecrypting[index] && !order?.decrypted
                                  ? "cursor-pointer active:scale-95"
                                  : "opacity-70"
                              }`}
                              onClick={() =>
                                !orderDecrypting[index] &&
                                !order?.decrypted &&
                                decryptOrder(order)
                              }
                            >
                              <div
                                className={`${
                                  orderDecrypting[index] && "animate-spin"
                                } w-fit h-fit flex items-center justify-center`}
                              >
                                {orderDecrypting[index] ? (
                                  <AiOutlineLoading color="white" size={12} />
                                ) : !order?.decrypted ? (
                                  "Decrypt"
                                ) : (
                                  "Decrypted"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative w-full h-fit flex flex-col items-center justify-start gap-3">
                          {order?.orderCollections?.map(
                            (coll: PrintItem, indexTwo: number) => {
                              return (
                                <div
                                  className="relative w-full h-fit flex md:flex-nowrap flex-wrap flex-row items-center justify-between gap-3"
                                  key={indexTwo}
                                >
                                  <div className="relative w-fit h-fit flex items-center justify-center">
                                    <div className="relative flex w-20 h-20 rounded-sm border border-white">
                                      <Image
                                        layout="fill"
                                        src={`${INFURA_GATEWAY}/ipfs/${
                                          coll?.collectionMetadata?.images?.[0]?.split(
                                            "ipfs://"
                                          )?.[1]
                                        }`}
                                        className="rounded-md"
                                        objectFit="cover"
                                        draggable={false}
                                      />
                                    </div>
                                  </div>
                                  <div className="relative w-full h-fit flex items-center justify-between gap-3 flex-wrap md:flex-nowrap">
                                    {(order?.encryptedFulfillment as Details)
                                      ?.sizes?.length > 0 && (
                                      <div className="relative flex w-fit h-fit items-center justify-center font-bit text-white">
                                        $
                                        {Number(
                                          coll?.prices?.[
                                            coll?.printType !==
                                              PrintType.Sticker &&
                                            coll?.printType !== PrintType.Poster
                                              ? 0
                                              : coll?.collectionMetadata?.sizes?.findIndex(
                                                  (s) =>
                                                    s ==
                                                    (
                                                      order?.encryptedFulfillment as Details
                                                    )?.sizes?.[indexTwo]
                                                )
                                          ]
                                        ) /
                                          Number(
                                            order?.grant?.levelInfo?.[
                                              Number(order?.level) - 2
                                            ]?.amounts?.[indexTwo]
                                          ) /
                                          10 ** 18}
                                      </div>
                                    )}
                                    <div className="relative flex w-fit h-fit items-center justify-center font-bit text-white">
                                      {/* {item?.isFulfilled || !details
                                        ? "Fulfilled"
                                        : "Fulfilling"} */}
                                    </div>
                                    <div className="relative flex w-fit h-fit items-center justify-center font-bit text-white">
                                      Qty.
                                      {Number(
                                        order?.grant?.levelInfo?.[
                                          Number(order?.level) - 2
                                        ]?.amounts?.[indexTwo]
                                      )}
                                    </div>
                                    {(order?.encryptedFulfillment as Details)
                                      ?.sizes?.length > 0 && (
                                      <div
                                        className={`relative flex h-fit border border-white p-px items-center justify-center font-bit text-white w-fit px-1`}
                                      >
                                        {order?.decrypted
                                          ? (
                                              order?.encryptedFulfillment as Details
                                            )?.sizes?.[indexTwo]
                                          : "??"}
                                      </div>
                                    )}
                                    {(order?.encryptedFulfillment as Details)
                                      ?.colors?.length > 0 && (
                                      <div
                                        className={`relative flex w-4 h-4 border border-white p-px rounded-full items-center justify-center text-sm font-bit text-white`}
                                        style={{
                                          backgroundColor: order?.decrypted
                                            ? `${
                                                (
                                                  order?.encryptedFulfillment as Details
                                                )?.colors?.[indexTwo]
                                              }`
                                            : "#131313",
                                        }}
                                      >
                                        {!order?.decrypted && "?"}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
