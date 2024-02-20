import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { MilestoneClaimProps } from "../types/modals.types";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { ImCross } from "react-icons/im";
import { setMilestoneClaim } from "../../../../redux/reducers/milestoneClaimSlice";

const MilestoneClaim: FunctionComponent<MilestoneClaimProps> = ({
  dispatch,
  cover,
  milestone,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[40vw] tablet:w-[30vw] h-fit max-h-[90vh] place-self-center bg-black rounded-lg border border-white rounded-sm overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#D07BF7"
              size={10}
              onClick={() =>
                dispatch(
                  setMilestoneClaim({
                    actionOpen: false,
                  })
                )
              }
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3 pb-4">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words font-vcr text-white text-sm">
              {` Congrats! You claimed Milestone ${milestone}!`}
            </div>
            <div
              className="relative w-40 h-40 flex items-center justify-center rounded-sm p-px"
              id="smoke"
            >
              <Image
                className="rounded-sm"
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${cover?.split("ipfs://")?.[1]}`}
                draggable={false}
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneClaim;
