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
  tokens,
}): JSX.Element => {
  return (
    <div className="relative w-3/4 justify-center items-center flex flex-row gap-1 h-fit">
      {ACCEPTED_TOKENS_MUMBAI?.filter((token) =>
        tokens?.includes(token[2])
      )?.map((item: string[], indexTwo: number) => {
        return (
          <div
            className={`relative w-6 h-7 rounded-full flex items-center cursor-pointer active:scale-95 ${
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
              layout="fill"
            />
          </div>
        );
      })}
    </div>
  );
};

export default PurchaseTokens;
