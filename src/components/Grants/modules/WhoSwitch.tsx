import { FunctionComponent } from "react";
import { WhoSwitchProps } from "../types/grant.types";
import InfiniteScroll from "react-infinite-scroll-component";

const WhoSwitch: FunctionComponent<WhoSwitchProps> = ({
  interactionState,
  setMirrorChoiceOpen,
  mirror,
  mirrorChoiceOpen,
  like,
  bookmark,
  dispatch,
  who,
  interactionsLoading,
  router,
  info,
  handleMoreWho,
  whoLoading
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-center justify-start">
      <InfiniteScroll
        loader={<></>}
        next={handleMoreWho}
        hasMore={info?.hasMore}
        dataLength={who?.length}
      >
        {who?.map((item, index: number) => {
          return <div key={index}></div>;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default WhoSwitch;
