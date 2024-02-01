import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import numeral from "numeral";
import { InteractionsProps } from "../types/grant.types";

const Interactions: FunctionComponent<InteractionsProps> = ({
  like,
  post,
  mirror,
  interactionsLoading,
  bookmark,
  mirrorChoiceOpen,
  setMirrorChoiceOpen,
  router,
  index,
}): JSX.Element => {
  return (
    <div className="relative w-24 h-fit border border-black rounded-md flex flex-col gap-2 p-2 items-center justify-center">
      {[
        {
          image: "QmRQVbnK1VajkBzjz9w2zFSSbC9fAdKRo7m53VuvhyvHa4",
          title: "Like",
          function: () => like(post?.id, post?.operations?.hasReacted!),
          loader: interactionsLoading?.like,
          amount: post?.stats?.reactions || 0,
        },
        {
          image: "QmVFm5onDqzKCV6v9XbGTQirXsWFmRgihsYcXVBbLMxneL",
          title: "Bookmark",
          function: () => bookmark(post?.id),
          loader: interactionsLoading?.bookmark,
          amount: post?.stats?.bookmarks || 0,
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
          amount: (post?.stats?.mirrors || 0) + (post?.stats?.quotes || 0),
        },
        {
          image: "QmRQVbnK1VajkBzjz9w2zFSSbC9fAdKRo7m53VuvhyvHa4",
          title: "Contributors",
          function: () => router.push(`/grant/${post?.id}`),
          loader: false,
          amount: post?.stats?.countOpenActions || 0,
        },
        {
          image: "QmRQVbnK1VajkBzjz9w2zFSSbC9fAdKRo7m53VuvhyvHa4",
          title: "Comments",
          function: () => router.push(`/grant/${post?.id}`),
          loader: false,
          amount: post?.stats?.comments || 0,
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
  );
};

export default Interactions;
