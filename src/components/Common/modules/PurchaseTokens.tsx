import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import { PurchaseTokensProps } from "../types/common.types";

const PurchaseTokens: FunctionComponent<PurchaseTokensProps> = ({
  details,
  setDetails,
  mainIndex,
  levelIndex,
}): JSX.Element => {
  return (
    <div className="relative w-3/4 justify-center items-center flex flex-row gap-1">
      {ACCEPTED_TOKENS_MUMBAI?.map((item: string[], indexTwo: number) => {
        return (
          <div
            className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
              details?.currency === item[2] ? "opacity-50" : "opacity-100"
            }`}
            key={indexTwo}
            onClick={() =>
              setDetails((prev) => {
                const arr = [...prev];
                arr[mainIndex][levelIndex] = {
                  ...arr[mainIndex][levelIndex],
                  currency: item[2],
                };
                return arr;
              })
            }
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
              className="flex"
              draggable={false}
              width={30}
              height={35}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PurchaseTokens;
