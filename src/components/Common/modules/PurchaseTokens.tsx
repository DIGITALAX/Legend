import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import { PurchaseTokensProps } from "../types/common.types";

const PurchaseTokens: FunctionComponent<PurchaseTokensProps> = ({
  checkoutCurrency,
  setCheckoutCurrency,
  index,
}): JSX.Element => {
  return (
    <div className="relative w-3/4 justify-center items-center flex flex-row gap-1">
      {ACCEPTED_TOKENS_MUMBAI?.map((item: string[], indexTwo: number) => {
        return (
          <div
            className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
              checkoutCurrency?.[index] === item[1]
                ? "opacity-50"
                : "opacity-100"
            }`}
            key={indexTwo}
            onClick={() => {
              const currencies = [...checkoutCurrency];
              currencies[index] = item[1];
              setCheckoutCurrency(currencies);
            }}
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
