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
import { AiOutlineLoading } from "react-icons/ai";

const LevelOne: FunctionComponent<LevelOneProps> = ({
  details,
  setDetails,
  mainIndex,
  oracleData,
  simpleCheckoutLoading,
  handleCheckout,
  cart,
  grant,
  spendApproved,
  approvePurchase,
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
        <Splits
          dPercent={0}
          fPercent={0}
          onlyGrantee
          price={10 ** 18}
          fBase={0}
        />
        <PurchaseTokens
          mainIndex={mainIndex}
          levelIndex={0}
          details={details}
          setDetails={setDetails}
          tokens={ACCEPTED_TOKENS_MUMBAI?.map((item) => item[2])}
        />
        <div className="relative flex justify-center items-center font-dog text-black text-xxs">
          {`${(
            Number("1000000000000000000") /
            Number(
              oracleData?.find(
                (or) =>
                  or?.currency?.toLowerCase() ==
                  details?.currency?.toLowerCase()
              )?.rate
            )
          ).toFixed(4)} ${
            ACCEPTED_TOKENS_MUMBAI?.find(
              (ac) => ac[2] == details?.currency
            )?.[1]
          }`}
        </div>
        {cart && (
          <div
            className={`w-40 h-8 cursor-pointer rounded-sm cursor-pointer active:scale-95 border border-black flex items-center justify-center text-center font-gam text-xl ${
              !grant?.publication?.operations?.hasActed?.value
                ? "bg-lima"
                : "bg-viol"
            }`}
            onClick={() =>
              !simpleCheckoutLoading &&
              (spendApproved
                ? handleCheckout!(
                    {
                      grant: grant!,
                      chosenLevel: {
                        level: 1,
                        collectionIds: [],
                        amounts: [],
                      },
                      amount: 1,
                      sizes: [0],
                      colors: [0],
                    },
                    details?.currency
                  )
                : approvePurchase!(
                    {
                      grant: grant!,
                      chosenLevel: {
                        level: 1,
                        collectionIds: [],
                        amounts: [],
                      },
                      amount: 1,
                      sizes: [0],
                      colors: [0],
                    },
                    details?.currency
                  ))
            }
          >
            <div
              className={`relative w-fit h-fit flex items-center justify-center ${
                simpleCheckoutLoading && "animate-spin"
              }`}
            >
              {simpleCheckoutLoading ? (
                <AiOutlineLoading size={15} color="black" />
              ) : !spendApproved ? (
                "Approve Token"
              ) : (
                "Contribute"
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelOne;
