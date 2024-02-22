import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  ACCEPTED_TOKENS,
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import moment from "moment";
import { MilestoneProps } from "../types/grant.types";

const Milestone: FunctionComponent<MilestoneProps> = ({
  index,
  mainIndex,
  milestone,
  metadata,
  changeCurrency,
  setChangeCurrency,
  acceptedTokens,
}) => {
  return (
    <div className="relative bg-offBlack border border-lima rounded-sm flex flex-col justify-start items-start px-2 py-1.5 font-dog h-fit gap-4">
      <div className="relative w-full h-28 flex items-center justify-center rounded-sm">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/${
            metadata?.cover?.split("ipfs://")?.[1]
          }`}
          layout="fill"
          className="rounded-sm"
          objectFit="cover"
          draggable={false}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b flex from-transparent to-offBlack"></div>
        <div className="absolute bottom-2 left-2 w-fit h-fit flex items-center justify-start text-xs text-white break-all">
          {`Milestone ${index + 1}`}
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-col items-start justify-center sm:gap-0 gap-4">
        <div className="relative w-full h-fit flex sm:flex-nowrap flex-wrap flex-row gap-2 justify-between sm:items-center items-start">
          <div className="relative w-fit h-fit flex flex-col sm:flex-row sm:gap-2 justify-start items-center text-white ml-0">
            <div className="relative w-fit h-fit flex items-center justify-center font-gam text-lg">
              Contribution Goal:
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center font-dog text-xxs top-px">
              {(
                Number(
                  milestone.currencyGoal?.find(
                    (item) => item.currency == changeCurrency
                  )?.amount
                ) /
                10 ** 18
              ).toFixed(2)}{" "}
              {
                ACCEPTED_TOKENS.find(
                  (token) => token[2] == changeCurrency
                )?.[1]
              }
            </div>
          </div>
          <div className="w-fit h-fit relative flex items-center justify-center ml-0 gap-2">
            {ACCEPTED_TOKENS?.filter((token) =>
              acceptedTokens?.includes(token[2])
            ).map((token: string[], indexTwo: number) => {
              return (
                <div
                  className={`relative w-5 h-6 rounded-full flex items-center cursor-pointer active:scale-95 ${
                    changeCurrency == token[2] ? "opacity-50" : "opacity-100"
                  }`}
                  key={indexTwo}
                  onClick={() =>
                    setChangeCurrency((prev) => {
                      const arr = [...prev];
                      arr[mainIndex] = token[2];
                      return arr;
                    })
                  }
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${token[0]}`}
                    className="flex"
                    draggable={false}
                    layout="fill"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={`relative w-fit h-fit flex flex-col sm:flex-row sm:gap-2 justify-start sm:items-center items-start text-white ml-0 ${moment(Number(milestone.submitBy) * 1000).isBefore(moment()) ? "text-marron": "text-white" }`}
        >
          <div className="relative w-fit h-fit flex items-center justify-center font-gam text-lg">
            Submit By:
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-dog text-xxs top-px">
            {milestone.submitBy &&
              moment(Number(milestone.submitBy) * 1000).fromNow()}
          </div>
        </div>
      </div>
      <div
        className="relative w-full max-h-[10rem] h-fit overflow-y-scroll flex items-start justify-start text-xxs text-white"
        id="side"
      >
        {metadata.description}
      </div>
    </div>
  );
};

export default Milestone;
