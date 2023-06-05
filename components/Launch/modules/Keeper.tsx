import TopBarThree from "@/components/Common/modules/TopBarThree";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { KeeperProps } from "../types/launch.types";
import { AiOutlineLoading } from "react-icons/ai";

const Keeper: FunctionComponent<KeeperProps> = ({
  keeperRegisterLoading,
  registerUpkeep,
  sendLink,
  balanceAmount,
  text,
}): JSX.Element => {
  return (
    <Draggable enableUserSelectHack={false}>
      <div className="relative w-full h-full z-0 flex items-center justify-center cursor-grab active:cursor-grabbing">
        <div className="flex-col flex relative w-96 h-11/12 bg-white border border-2 border-mazul overflow-y-scroll">
          <TopBarThree text={"KEEPER REGISTRY"} />
          <div className="flex w-full h-fit flex-col gap-6 font-mega text-white items-start justify-center p-3">
            <div className="flex flex-col relative w-full h-fit gap-10 items-center justify-center">
              <div className="relative text-mazul w-fit h-fit text-center">
                You need to register your contract with the Chainlink Keeper
                Registry.
              </div>
              <div className="relative w-full h-fit bg-blez p-3 rounded-md flex flex-col gap-2 font-earl text-black text-center items-center justify-center">
                Make sure you also have at least 2 LINK in your wallet to send
                to the register contract.
                <div className="relative w-fit h-fit flex items-center justify-center">
                  Wallet Balance:{" "}
                  {balanceAmount &&
                    balanceAmount / Number("1000000000000000000")}{" "}
                  LINK
                </div>
              </div>
              <div
                className={`relative bg-darker border border-black flex w-32 text-center text-sm justify-center items-center h-9 p-1 font-earl text-white uppercase cursor-pointer active:scale-95`}
                onClick={() =>
                  text == "send link"
                    ? sendLink()
                    : text == "register keeper" ? registerUpkeep() : window.open(`https://`)
                }
              >
                {keeperRegisterLoading ? (
                  <div className="relative w-fit h-fit items-center justify-center flex animate-spin">
                    <AiOutlineLoading size={15} color="white" />
                  </div>
                ) : (
                  text
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Keeper;
