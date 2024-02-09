import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import PurchaseTokens from "@/components/Common/modules/PurchaseTokens";
import { LevelOneProps } from "../types/launch.types";
import Splits from "./Splits";

const LevelOne: FunctionComponent<LevelOneProps> = ({
  details,
  setDetails,
  mainIndex,
  oracleData,
  price,
}): JSX.Element => {
  return (
    <div className="relative w-72 h-full flex flex-col">
      <Bar title={`Collect Lvl.1`} />
      <div className="relative w-full h-110 flex flex-col bg-offWhite justify-between items-center p-2 border-b border-x rounded-b-sm border-black gap-4">
        <div className="relative w-52 h-52 rounded-sm border border-black flex items-center justify-center">
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmcmJDNg69MwQMXRkYjz2zJcV8wfwnuSLRXgNAChR3mh7C`}
            draggable={false}
            className="rounded-sm"
          />
        </div>
        <div className="relative flex items-center text-center justify-center w-fit text-sm font-net break-words">
          {`Quick Collect (No Prints)`}
        </div>
        <Splits designer={0} fulfiller={0} onlyGrantee grantee={100} />
        <PurchaseTokens
          mainIndex={mainIndex}
          levelIndex={0}
          details={details}
          setDetails={setDetails}
        />
        <div className="relative flex justify-center items-center font-dog text-black text-xxs">
          {`${(
            (Number(price) *
              Number(
                oracleData?.find(
                  (or) =>
                    or?.currency?.toLowerCase() ==
                    details.currency?.toLowerCase()
                )?.wei
              )) /
            Number(
              oracleData?.find(
                (or) =>
                  or?.currency?.toLowerCase() == details.currency?.toLowerCase()
              )?.rate
            )
          ).toFixed(3)} ${
            ACCEPTED_TOKENS_MUMBAI?.find((ac) => ac[2] == details.currency)?.[1]
          }`}
        </div>
      </div>
    </div>
  );
};

export default LevelOne;
