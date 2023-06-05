import { FunctionComponent } from "react";
import { SmallBoxProps } from "../types/common.types";
import TopBarTwo from "./TopBarTwo";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";

const SmallBox: FunctionComponent<SmallBoxProps> = ({
  title,
  onChangeFunction,
  value,
  collapseNumber,
  dispatch,
  index,
}): JSX.Element => {
  return (
    <div className="relative w-40 h-fit flex flex-col rounded-md bg-offWhite border-2 border-mazul">
      <TopBarTwo
        collapseNumber={collapseNumber}
        dispatch={dispatch}
        index={index}
      />
      <div className={`p-2 w-full h-full flex-col gap-2 ${
            collapseNumber[index] ? "hidden" : "flex"
          }`}>
        <div className="relative w-fit h-fit flex font-mega text-lg uppercase text-mazul p-2">
          {title}
        </div>
        <div className="relative w-full h-full flex bg-oscura">
          <div className="absolute w-full h-full flex opacity-70">
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
              draggable={false}
            />
          </div>
          <input
            className="relative w-full h-full flex p-2 text-black font-earl text-sm bg-transparent rounded-md"
            type="number"
            onChange={onChangeFunction}
            value={value}
          />
        </div>
      </div>
    </div>
  );
};

export default SmallBox;
