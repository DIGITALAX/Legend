import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { RxCross1 } from "react-icons/rx";
import { ErrorProps } from "../types/modals.types";
import { setErrorModal } from "../../../../redux/reducers/errorModalSlice";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const Error: FunctionComponent<ErrorProps> = ({
  message,
  dispatch,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full sm:w-[50vw] lg:w-[30vw] h-fit col-start-1 place-self-center bg-black rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <RxCross1
                  color="white"
                  size={15}
                  onClick={() =>
                    dispatch(
                      setErrorModal({
                        actionValue: false,
                        actionMessage: "",
                      })
                    )
                  }
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-6">
                <div className="relative w-3/4 h-fit justify-center items-center text-offWhite font-dog text-xxs text-center">
                  {message}
                </div>
                <div className="relative w-2/3 h-36 preG:h-40 lg:h-28 xl:h-40 justify-center items-center rounded-sm border border-white bg-offWhite/70">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmeB3aEj54mcnHZCekZWU47nJ19m515EemArGMi5rg3vt7`}
                    layout="fill"
                    objectPosition={"top"}
                    objectFit="cover"
                    className="rounded-sm"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
