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
  acceptedTokens,
}): JSX.Element => {
  return (
    <div className="relative w-72 h-full flex flex-col">
      <Bar title={`Collect Lvl.1`} />
      <div className="relative w-full h-110 flex flex-col bg-white justify-between items-center p-2 border-b border-x rounded-b-sm border-black gap-4">
        <div className="relative w-fit h-fit flex items-center justify-center gap-3 flex-col">
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
        </div>
        {!cart && (
          <Splits
            dPercent={0}
            fPercent={0}
            onlyGrantee
            price={10 ** 18}
            fBase={0}
          />
        )}

        <div className="relative mb-0 flex items-center justify-center flex flex-col gap-4">
          <div className="relative flex justify-center items-center flex-col gap-1.5 w-full h-fit">
            <div className="relative flex justify-center items-center font-dog text-black text-xxs h-fit w-fit">
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
            <div className="relative w-3/4 h-fit flex items-center justify-center">
              <PurchaseTokens
                mainIndex={mainIndex}
                levelIndex={0}
                details={details}
                setDetails={setDetails}
                tokens={acceptedTokens}
              />
            </div>
          </div>

          {cart && (
            <div
              className={`w-40 h-8 cursor-pointer rounded-sm cursor-pointer active:scale-95 border flex flex-row gap-3 items-center justify-center text-center font-dog text-super ${
                !spendApproved
                  ? "bg-lima/70 text-mar border-mar"
                  : !grant?.publication?.operations?.hasActed?.value
                  ? "bg-mar/70 text-lima border-lima"
                  : "bg-viol/70 text-white border-viol"
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
                className={`relative w-fit h-fit flex items-center justify-center uppercase ${
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
              <div className="relative w-4 h-4 flex items-center justify-center">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmNoDqqXhGyz7DcGmFAoXS8z5JPXzkp5CgDDKgecJxDaxw`}
                  draggable={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelOne;
