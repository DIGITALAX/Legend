import Image from "next/legacy/image";
import { FunctionComponent, SetStateAction } from "react";
import {
  ACCEPTED_TOKENS,
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import { PurchaseTokensProps } from "../types/common.types";
import { Details } from "@/components/Launch/types/launch.types";

const PurchaseTokens: FunctionComponent<PurchaseTokensProps> = ({
  details,
  setDetails,
  mainIndex,
  levelIndex,
  tokens,
  main,
}): JSX.Element => {
  return (
    <div className="relative w-fit justify-center items-center flex flex-row gap-1 h-fit">
      {ACCEPTED_TOKENS?.filter((token) =>
        tokens?.includes(token[2])
      )?.map((item: string[], indexTwo: number) => {
        return (
          <div
            className={`relative rounded-full flex items-center cursor-pointer active:scale-95 ${
              (main ? details : (details as Details)?.currency) === item[2]
                ? "opacity-50"
                : "opacity-100"
            } ${main ? "w-8 h-9" : "w-6 h-7"}`}
            key={indexTwo}
            onClick={() =>
              main
                ? (setDetails as (e: SetStateAction<string>) => void)(item[2])
                : (setDetails as (e: SetStateAction<Details[][]>) => void)(
                    (prev) => {
                      const arr = [...prev];
                      arr[mainIndex][levelIndex] = {
                        ...arr[mainIndex][levelIndex],
                        currency: item[2],
                      };
                      return arr;
                    }
                  )
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
