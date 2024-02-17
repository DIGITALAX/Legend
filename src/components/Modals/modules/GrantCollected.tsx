import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { GrantCollectedProps } from "../types/modals.types";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { ImCross } from "react-icons/im";
import { setGrantCollected } from "../../../../redux/reducers/grantCollectedSlice";

const GrantCollected: FunctionComponent<GrantCollectedProps> = ({
  dispatch,
  details,
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
                  setGrantCollected({
                    actionValue: false,
                  })
                )
              }
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3 pb-4">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words font-vcr text-white text-sm">
              Congrats! You just contributed! <br /> <br />
              {details?.chosenLevel?.level !== 1 &&
                "Keep up with fulfillment on your account page."}
            </div>

            <div
              className="relative w-40 h-40 flex items-center justify-center rounded-sm p-px"
              id="smoke"
            >
              <Image
                className="rounded-sm"
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  details?.chosenLevel?.level > 1
                    ? details?.chosenLevel?.collectionIds?.[0]?.collectionMetadata?.images?.[0]?.split(
                        "ipfs://"
                      )?.[1]
                    : "QmcmJDNg69MwQMXRkYjz2zJcV8wfwnuSLRXgNAChR3mh7C"
                }`}
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

export default GrantCollected;
