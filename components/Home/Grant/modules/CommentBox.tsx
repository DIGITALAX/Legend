import { INFURA_GATEWAY } from "@/lib/constants";
import { setCollapseItem } from "@/redux/reducers/collapseItemSlice";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { CommentBoxProps } from "../types/grant.types";

const CommentBox: FunctionComponent<CommentBoxProps> = ({
  collapseNumber,
  dispatch,
  index,
}): JSX.Element => {
  return (
    <Draggable
      enableUserSelectHack={false}
      // nodeRef={commentRef as any}
      cancel=".stopDrag"
    >
      <div
        className={`relative w-80 flex drop-shadow-2xl ${
          collapseNumber[index] ? "h-4" : "h-100"
        }`}
      >
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/QmbpFBk93UDXB5PKLhhXbn6tNKG1XDUJjS6SiSeG7S2GMB`}
          className="w-full h-full flex relative"
          draggable={false}
        />
        <div
          className="stopDrag flex absolute w-full h-4 top-1 left-0 px-3 cursor-pointer"
          onClick={() =>
            dispatch(
              setCollapseItem(
                [...collapseNumber].map((item, i) =>
                  i === index ? (item === true ? false : true) : item
                )
              )
            )
          }
        >
          <div className="relative flex justify-center items-center w-full h-full">
            <Image
              src={`${INFURA_GATEWAY}/QmYfpEREcRAMyretbQbT7YFtJHZLeR948iCezLTgvcUFYS`}
              layout="fill"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default CommentBox;
