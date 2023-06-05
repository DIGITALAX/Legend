import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { WalletProps } from "../types/layout.types";
import { AiOutlineLoading } from "react-icons/ai";

const Wallet: FunctionComponent<WalletProps> = ({
  handleTransaction,
  profile,
  buttonText,
  signInLoading,
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit h-12 font-geom text-white flex flex-row items-center px-2 text-center justify-center cursor-pointer`}
      onClick={() => !profile && handleTransaction()}
    >
      {signInLoading ? (
        <div className="relative w-20 h-fit flex items-center justify-center animate-spin">
          <AiOutlineLoading size={15} color="white" />
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          {buttonText}
        </div>
      )}
    </div>
  );
};

export default Wallet;
