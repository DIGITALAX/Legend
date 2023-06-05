import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { TopBarTwoProps } from "../types/common.types";
import { setCollapseItemLaunch } from "@/redux/reducers/collapseItemLaunchSlice";

const TopBarTwo: FunctionComponent<TopBarTwoProps> = ({
  deleteFunction,
  dispatch,
  collapseNumber,
  index,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col border-b border-b-2 border-mazul">
      <div className="absolute w-full h-full opacity-30">
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/QmaCMECk5avUxcLT2oYTiJ3CLXQF1uvHSwuhq8ZrVpm6Bg`}
          objectFit="cover"
          draggable={false}
        />
      </div>
      <div className="relative flex flex-row gap-2 justify-start items-center p-1.5">
        <div
          className={`border border-mazul bg-white h-4 w-4 rounded-full items-center justify-center flex font-mega text-xs p-1 text-mazul ${
            deleteFunction && "cursor-pointer"
          }`}
          onClick={deleteFunction && deleteFunction}
        >
          <div className="relative w-fit h-fit items-center justify-center flex">
            x
          </div>
        </div>
        <div
          className="border border-mazul bg-white h-4 w-4 items-center rounded-full justify-center flex font-mega text-xs p-1 text-mazul"
          onClick={() =>
            dispatch &&
            collapseNumber &&
            dispatch(
              setCollapseItemLaunch(
                [...collapseNumber].map((item, i) =>
                  i === index ? true : item
                )
              )
            )
          }
        >
          <div className="relative w-fit h-fit items-center justify-center flex">
            -
          </div>
        </div>
        <div
          className="border border-mazul bg-white h-4 w-4 items-center rounded-full justify-center flex font-mega p-1 cursor-pointer"
          onClick={() =>
            dispatch &&
            collapseNumber &&
            dispatch(
              setCollapseItemLaunch(
                [...collapseNumber].map((item, i) =>
                  i === index ? false : item
                )
              )
            )
          }
        >
          <div className="flex w-full h-full items-center justify-center border border-mazul"></div>
        </div>
      </div>
    </div>
  );
};

export default TopBarTwo;
