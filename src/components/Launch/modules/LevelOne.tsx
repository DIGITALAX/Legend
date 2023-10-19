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
  checkoutCurrency,
  setCheckoutCurrency,
  oracleData,
}): JSX.Element => {
  return (
    <div className="relative w-72 h-full flex flex-col">
      <Bar title={`Collect Lvl.1`} />
      <div className="relative w-full h-fit flex flex-col bg-offWhite justify-start items-center p-2 border-b border-x rounded-b-sm border-black gap-4">
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
        <Splits
          designer={0}
          fulfiller={0}
          grantee={
            10 ** 18 /
            Number(
              oracleData.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS_MUMBAI.find((item) => {
                    if (checkoutCurrency && item[1] === checkoutCurrency[0]) {
                      return item[2];
                    }
                  })?.[0]
              )?.rate
            ) /
            Number(
              oracleData.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS_MUMBAI.find((item) => {
                    if (item[1] === checkoutCurrency?.[0]) {
                      return item[2];
                    }
                  })?.[0]
              )?.wei
            )
          }
        />
        <PurchaseTokens
          index={0}
          checkoutCurrency={checkoutCurrency}
          setCheckoutCurrency={setCheckoutCurrency}
        />
        <div className="relative flex justify-center items-center font-dog text-black text-xxs">
          {`${
            10 ** 18 /
            Number(
              oracleData.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS_MUMBAI.find((item) => {
                    if (checkoutCurrency && item[1] === checkoutCurrency[0]) {
                      return item[2];
                    }
                  })?.[0]
              )?.rate
            ) /
            Number(
              oracleData.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS_MUMBAI.find((item) => {
                    if (item[1] === checkoutCurrency?.[0]) {
                      return item[2];
                    }
                  })?.[0]
              )?.wei
            )
          } ${checkoutCurrency?.[0]}`}
        </div>
      </div>
    </div>
  );
};

export default LevelOne;
