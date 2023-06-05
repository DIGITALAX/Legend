import TopBarThree from "@/components/Common/modules/TopBarThree";
import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ContractsProps } from "../types/launch.types";
import Draggable from "react-draggable";

const Contracts: FunctionComponent<ContractsProps> = ({
  createContracts,
  createContractsLoading,
  addresses,
}): JSX.Element => {
  return (
    <Draggable enableUserSelectHack={false}>
      <div className="relative w-full h-full z-0 flex items-center justify-center cursor-grab active:cursor-grabbing">
        <div className="flex-col flex relative w-96 h-11/12 bg-white border border-2 border-mazul overflow-y-scroll">
          <TopBarThree text={"LEGEND FACTORY"} />
          <div className="flex w-full h-fit flex-col gap-6 font-mega text-white items-start justify-center p-3">
            <div className="flex flex-col relative w-full h-fit gap-10 items-center justify-center">
              <div className="relative text-mazul w-fit h-fit text-center">
                You are deploying 3 contracts from Legend Factory on Polygon,
                make sure that you have enough gas.
              </div>
              <div
                className={`relative bg-darker border border-black flex w-32 text-center text-sm justify-center items-center h-9 p-1 font-earl text-white uppercase cursor-pointer active:scale-95`}
                onClick={() => createContracts()}
              >
                {createContractsLoading ? (
                  <div className="relative w-fit h-fit items-center justify-center flex animate-spin">
                    <AiOutlineLoading size={15} color="white" />
                  </div>
                ) : (
                  "factory deploy"
                )}
              </div>
              <div className="relative flex flex-col w-full h-fit gap-4 font-earl">
                <div className="relative w-full h-fit gap-1 flex flex-col">
                  <div className="relative w-fit h-fit flex text-mazul">
                    Access Controls Address:
                  </div>
                  <div
                    className="relative w-full h-8 flex text-white bg-mazul p-2 text-sm rounded-md cursor-pointer hover:opacity-70"
                    onClick={() =>
                      window.open(
                        `https://www.polygonscan.com/address/${addresses[1]}#code`
                      )
                    }
                  >
                    {addresses[1]}
                  </div>
                </div>
                <div className="relative w-full h-fit gap-1 flex flex-col">
                  <div className="relative w-fit h-fit flex text-mazul">
                    Legend Dynamic NFT Address:
                  </div>
                  <div
                    className="relative w-full h-8 flex text-white bg-mazul p-2 text-sm rounded-md cursor-pointer hover:opacity-70"
                    onClick={() =>
                      window.open(
                        `https://www.polygonscan.com/address/${addresses[2]}#code`
                      )
                    }
                  >
                    {addresses[2]}
                  </div>
                </div>
                <div className="relative w-full h-fit gap-1 flex flex-col">
                  <div className="relative w-fit h-fit flex text-mazul">
                    Legend Keeper Address:
                  </div>
                  <div
                    className="relative w-full h-8 flex text-white bg-mazul p-2 text-sm rounded-md cursor-pointer hover:opacity-70"
                    onClick={() =>
                      window.open(
                        `https://www.polygonscan.com/address/${addresses[0]}#code`
                      )
                    }
                  >
                    {addresses[0]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Contracts;
