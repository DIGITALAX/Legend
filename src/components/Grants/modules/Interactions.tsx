import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import numeral from "numeral";
import { InteractionsProps } from "../types/grant.types";
import { setPost } from "../../../../redux/reducers/postSlice";

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
  dispatch,
  main,
  setInteractionState,
  setCommentBoxOpen,
  grant,
}): JSX.Element => {
  return (
    <div className="relative rounded-sm w-full h-fit p-1 items-center justify-between flex bg-mar/75 border border-lima">
      <div className="relative w-full h-fit rounded-md flex flex-row gap-2 p-2 items-center justify-between font-vcr text-lima text-sm">
        {[
          {
            image: "Qmc476o4FyTJV4e93xNaj9DhWWqC9uQAgExWf4SytZTcV2",
            title: "Like",
            function: () => like(post?.id, post?.operations?.hasReacted!, main),
            loader: interactionsLoading?.like,
            amount: post?.stats?.reactions || 0,
            width: "1.3rem",
            height: "1.3rem",
            otherFunction: router.asPath.includes("/grant/")
              ? () => setInteractionState!("reacts")
              : undefined,
          },
          {
            image: "QmUihJCeEsFyGSm9gHC5r8p5KnmYsiTJ86AssjUs3CuYm8",
            title: "Bookmark",
            function: () => bookmark(post?.id, main),
            loader: interactionsLoading?.bookmark,
            amount: post?.stats?.bookmarks || 0,
            width: "1.3rem",
            height: "1.3rem",
          },
          {
            image: "Qmc7zi79rtM6K1Q32GSX7dWTE3MehD2uVTcW7sxCTWHgM5",
            title: "Mirror",
            function: () =>
              setMirrorChoiceOpen((prev) => {
                const old = [...prev];
                old[index] = !old[index];
                return old;
              }),
            loader: false,
            amount: (post?.stats?.mirrors || 0) + (post?.stats?.quotes || 0),
            width: "1.3rem",
            height: "1.3rem",
            otherFunction: router.asPath.includes("/grant/")
              ? () => setInteractionState!("mirrors")
              : undefined,
          },
          {
            image: "Qmbua3Ajr1wYbNk4tmUmS2qpbQYcyr9JkzQrQjWz19TD7L",
            title: "Contributor",
            function: () =>
              router.asPath == "/" || !router.asPath.includes("/grant/")
                ? grant
                  ? window.open(grant)
                  : router.push(`/grant/${post?.id}`)
                : setInteractionState!("contributors"),
            loader: false,
            amount: post?.stats?.countOpenActions || 0,
            width: "1.3rem",
            height: "1.3rem",
            otherFunction: router.asPath.includes("/grant/")
              ? () => setInteractionState!("contributors")
              : undefined,
          },
          {
            image: "QmWbxnHzxzNGQswu9qLEaAyncptzuacYhUmbVi695Ftw1y",
            title: "Comment",
            function: () =>
              router.asPath == "/" || !router.asPath.includes("/grant/")
                ? grant
                  ? window.open(grant)
                  : router.push(`/grant/${post?.id}`)
                : main
                ? setInteractionState!("comments")
                : setCommentBoxOpen!((prev) => {
                    const arr = [...prev];
                    arr[index] = !arr[index];
                    return arr;
                  }),
            otherFunction: router.asPath.includes("/grant/")
              ? () => setInteractionState!("comments")
              : undefined,
            loader: false,
            amount: post?.stats?.comments || 0,
            width: "1.2rem",
            height: "1rem",
          },
        ].map(
          (
            item: {
              image: string;
              title: string;
              function: () => void;
              loader: boolean;
              amount: number;
              width: string;
              height: string;
              otherFunction?: () => void;
            },
            indexTwo: number
          ) => {
            return (
              <div
                key={indexTwo}
                className="relative w-fit h-fit flex flex-row items-center justify-center gap-3 text-center"
                title={item.title}
              >
                {item?.loader ? (
                  <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                    <AiOutlineLoading size={17} color="white" />
                  </div>
                ) : (
                  <div
                    className={`relative flex items-center justify-center cursor-pointer active:scale-95`}
                    onClick={() => !item?.loader && item?.function()}
                    style={{
                      width: item.width,
                      height: item.height,
                    }}
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/${item?.image}`}
                      draggable={false}
                    />
                  </div>
                )}
                <div
                  className={`relative w-fit h-fit items-center justify-center flex ${
                    item.otherFunction !== undefined && "cursor-pointer"
                  }`}
                  onClick={() =>
                    item.otherFunction !== undefined && item.otherFunction()
                  }
                >
                  {numeral(item.amount).format("0a")}
                </div>
              </div>
            );
          }
        )}
        {mirrorChoiceOpen && (
          <div className="absolute left-1/2 -top-10 w-fit h-fit border border-lima rounded-sm bg-mar/90 flex flex-row gap-5 items-center justify-center py-2 px-1.5">
            {[
              {
                image: "Qmc7zi79rtM6K1Q32GSX7dWTE3MehD2uVTcW7sxCTWHgM5",
                title: "Mirror",
                function: () => mirror(post?.id, main),
                loader: interactionsLoading?.mirror,
                width: "1.3rem",
                height: "1.3rem",
              },
              {
                image: "QmW7jxRRLLbBMyzMbaUqb8B4ViZPSQ6ygJ2HVYahuBQQQx",
                title: "Quote",
                function: () =>
                  dispatch(
                    setPost({
                      actionQuote: post,
                      actionValue: true,
                    })
                  ),
                loader: false,
                width: "0.5rem",
                height: "1.3rem",
              },
            ].map((item, indexTwo) => {
              return (
                <div
                  key={indexTwo}
                  className="relative w-fit h-fit flex flex-row items-center justify-center gap-3 text-center"
                  title={item.title}
                >
                  {item?.loader ? (
                    <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                      <AiOutlineLoading size={15} color="white" />
                    </div>
                  ) : (
                    <div
                      className={`relative flex items-center justify-center cursor-pointer active:scale-95`}
                      onClick={() => !item?.loader && item?.function()}
                      style={{
                        width: item.width,
                        height: item.height,
                      }}
                    >
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/${item?.image}`}
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Interactions;
