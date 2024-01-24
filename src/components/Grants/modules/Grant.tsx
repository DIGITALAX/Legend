import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Bar from "@/components/Common/modules/Bar";
import { GrantProps } from "../types/grant.types";
import { AiOutlineLoading } from "react-icons/ai";
import { LevelInfo } from "@/components/Launch/types/launch.types";
import CollectItem from "@/components/Common/modules/CollectItem";
import { ImageMetadataV3 } from "../../../../graphql/generated";
import numeral from "numeral";

const Grant: FunctionComponent<GrantProps> = ({
  grant,
  mirror,
  like,
  bookmark,
  router,
  interactionsLoading,
  dispatch,
  setMirrorChoiceOpen,
  mirrorChoiceOpen,
  index,
}) => {
  return (
    <div className="relative h-fit w-[30rem] border border-black flex flex-col items-center justify-center bg-black">
      <Bar title={(grant?.publication?.metadata as ImageMetadataV3)?.title!} />
      <div className="relative w-full h-fit flex flex-col gap-8" id="grant">
        <div className="p-5 relative w-full h-fit flex items-center justify-center flex-row gap-5">
          <div className="relative w-full h-fit flex break-words font-vcr text-black p-2 justify-start items-center rounded-sm border border-black bg-offWhite p-2 flex-col gap-4">
            <div className="relative w-full h-40 flex items-center justify-start gap-6">
              <div className="relative w-full overflow-y-scroll h-full ustify-start items-center">
                {(grant?.publication?.metadata as ImageMetadataV3)?.content}
              </div>
              <div className="relative w-24 h-fit border border-black rounded-md flex flex-col gap-2 p-2 items-center justify-center">
                {[
                  {
                    image: "QmRQVbnK1VajkBzjz9w2zFSSbC9fAdKRo7m53VuvhyvHa4",
                    title: "Like",
                    function: () =>
                      like(
                        grant?.publication?.id,
                        grant?.publication?.operations?.hasReacted!,
                        false
                      ),
                    loader: interactionsLoading?.[index]?.like,
                    amount: grant?.publication?.stats?.reactions || 0,
                  },
                  {
                    image: "QmVFm5onDqzKCV6v9XbGTQirXsWFmRgihsYcXVBbLMxneL",
                    title: "Bookmark",
                    function: () => bookmark(grant?.publication?.id),
                    loader: interactionsLoading?.[index]?.bookmark,
                    amount: grant?.publication?.stats?.bookmarks || 0,
                  },
                  {
                    image: "QmRsAM1oJfiv1Py92uoYk7VMdrnPfWDsgH3Y2tPWVDqxHw",
                    title: "Mirror",
                    function: () =>
                      setMirrorChoiceOpen((prev) => {
                        const old = [...prev];
                        !old[index];
                        return old;
                      }),
                    loader: false,
                    amount:
                      (grant?.publication?.stats?.mirrors || 0) +
                      (grant?.publication?.stats?.quotes || 0),
                  },
                  {
                    image: "QmRQVbnK1VajkBzjz9w2zFSSbC9fAdKRo7m53VuvhyvHa4",
                    title: "Contributors",
                    function: () =>
                      router.push(`/grant/${grant?.publication?.id}`),
                    loader: false,
                    amount: grant?.publication?.stats?.countOpenActions || 0,
                  },
                  {
                    image: "QmRQVbnK1VajkBzjz9w2zFSSbC9fAdKRo7m53VuvhyvHa4",
                    title: "Comments",
                    function: () =>
                      router.push(`/grant/${grant?.publication?.id}`),
                    loader: false,
                    amount: grant?.publication?.stats?.comments || 0,
                  },
                ].map(
                  (
                    item: {
                      image: string;
                      title: string;
                      function: () => void;
                      loader: boolean;
                      amount: number;
                    },
                    indexTwo: number
                  ) => {
                    return (
                      <div
                        key={indexTwo}
                        className="relative w-fit h-fit flex flex-row items-center justify-center gap-3 font-vcr text-black text-center"
                        onClick={() => !item?.loader && item?.function()}
                      >
                        {item?.loader ? (
                          <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                            <AiOutlineLoading size={15} color="white" />
                          </div>
                        ) : (
                          <div className="relative w-4 h-3 flex items-center justify-center cursor-pointer active:scale-95">
                            <Image
                              layout="fill"
                              src={`${INFURA_GATEWAY}/ipfs/${item?.image}`}
                              draggable={false}
                            />
                          </div>
                        )}
                        <div className="relative w-fit h-fit items-center justify-center flex cursor-pointer">
                          {numeral(item.amount).format("0a")}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <div className="relative w-full h-fit flex justify-start items-start flex-col ml-0 gap-2">
              <div className="relative text-black font-gam text-4xl justify-start items-start flex">
                Grant Team
              </div>
              <div className="relative w-full items-center justify-between flex flex-row gap-2">
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <Image
                    draggable={false}
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmPe1QiaErMPHPRU3hQK4HsW4KeKjXVG8y8x7aKHNXcRh8`}
                  />
                </div>
                <div className="relative mr-0 w-fit h-fit items-center justify-end flex flex-row gap-2">
                  {Array.from({ length: 3 }).map((_, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative w-10 h-10 rounded-sm border border-black cursor-pointer"
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-fit h-full items-end justify-center flex">
            <div className="relative w-8 rounded-lg h-60 flex items-end justify-center border-2 border-black bg-zana"></div>
          </div>
        </div>
        <div
          className="relative w-full h-80 overflow-y-scroll bg-offWhite border-y border-black flex flex-col gap-4 p-4"
          id="milestone"
        >
          {Array.from({ length: 3 }).map((_, index: number) => {
            return (
              <div
                key={index}
                className="relative bg-cafe border border-marron rounded-sm flex flex-col justify-start items-start p-1.5 font-dog text-amar h-fit gap-4"
              >
                <div className="relative w-fit h-fit flex items-center justify-start text-sm">
                  {`Milestone ${index + 1}`}
                </div>
                <div className="relative w-full h-72 flex items-center justify-between flex-row gap-2">
                  <div className="relative h-full overflow-y-scroll w-full flex items-start justify-start p-1.5"></div>
                  <div className="relative w-60 h-full border border-marron flex items-center justify-center rounded-sm bg-virg">
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        grant?.publication?.metadata.marketplace?.image?.raw.uri?.split(
                          "ipfs://"
                        )?.[1]
                      }`}
                      layout="fill"
                      className="rounded-sm w-full h-full"
                      objectFit="cover"
                      draggable={false}
                    />
                  </div>
                </div>
                <div className="relative flex flex-col items-start justify-start gap-8 border border-white rounded-sm w-full h-fit p-2">
                  <div className="relative w-full h-fit flex items-center justify-between flex-row text-xxs text-white font-dog">
                    <div className="relative w-fit h-fit flex flex-col gap-1 items-start justify-start">
                      <div>Amount:</div>
                      <div>$5000</div>
                    </div>
                    <div className="relative w-fit h-fit flex flex-col gap-1 items-start justify-start">
                      <div>Submit By:</div>
                      <div>{new Date().toDateString()}</div>
                    </div>
                  </div>
                  <div className="relative w-full h-fit items-center justify-start text-white text-xxs font-dog flex flex-col gap-4">
                    <div className="relative w-full h-6 rounded-lg border border-white bg-amar/60 text-black text-center flex items-center justify-center">
                      Not Completed
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="relative flex flex-col items-center justify-center w-full h-fit gap-2 p-5">
          <div className="relative w-fit px-2 py-1 h-12 text-center flex items-center justify-center bg-lima border border-black font-gam uppercase text-6xl text-mar">
            collect grant
          </div>
          <div
            className="relative w-full h-fit bg-offWhite p-2 rounded-sm border border-black overflow-x-scroll items-start justify-start flex flex-col"
            id="milestone"
          >
            <div className="relative w-fit h-fit flex flex-row gap-4 pb-2 items-start justify-start">
              {grant?.levelInfo?.map((level: LevelInfo, index: number) => {
                return (
                  <CollectItem
                    key={index}
                    dispatch={dispatch}
                    levelInfo={level}
                    id={grant?.publication?.id}
                    router={router}
                    cart
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grant;
