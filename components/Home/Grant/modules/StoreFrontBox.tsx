import { INFURA_GATEWAY } from "@/lib/constants";
import { setCollapseItem } from "@/redux/reducers/collapseItemSlice";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { StorefrontBoxProps } from "../types/grant.types";

const StoreFrontBox: FunctionComponent<StorefrontBoxProps> = ({
  collapseNumber,
  dispatch,
  index,
}): JSX.Element => {
  return (
    <Draggable
      enableUserSelectHack={false}
      //   nodeRef={grantRef as any}
      cancel=".stopDrag"
    >
      <div
        className={`absolute -bottom-40 right-10 w-80 flex p-1 drop-shadow-2xl ${
          collapseNumber[index] ? "h-4" : "h-100"
        }`}
      >
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/QmUX8xCW3ErrfdQgv5LKwqgjgmbGn98PJ9cPNyPmtqF2hy`}
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
        {!collapseNumber[index] && (
          <div className="flex absolute w-10 h-10 -bottom-3 -right-3">
            <Image
              src={`${INFURA_GATEWAY}/QmfFZs7NE11VhEMg2bf4XeuQ37mPhrEwq1XKAFzM6eyVQQ`}
              layout="fill"
              draggable={false}
            />
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default StoreFrontBox;
