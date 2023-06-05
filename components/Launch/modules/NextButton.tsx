import { FunctionComponent } from "react";
import { NextButtonProps } from "../types/launch.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";

const NextButton: FunctionComponent<NextButtonProps> = ({
  setPage,
  text,
}): JSX.Element => {
  return (
    <div
      className="relative w-20 h-12 flex flex-col cursor-pointer active:scale-95"
      onClick={setPage}
    >
      <div className="absolute w-full h-full flex">
        <Image
          src={`${INFURA_GATEWAY}/${
            text === "BACK"
              ? "QmYuu3xhueUokut6GuSBGYqxmE8iWi74FhnZsE9o1xQxCT"
              : "QmcTmk1ExZ7fb9MkNhAaDmkLtTAaLt6CkbGndV3bvvthED"
          }`}
          layout="fill"
          draggable={false}
        />
      </div>
      <div className="text-white font-earl text-xs flex relative w-full h-full -top-1.5 left-2 uppercase items-center justify-center">
        {text}
      </div>
    </div>
  );
};

export default NextButton;
