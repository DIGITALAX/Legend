import { FunctionComponent } from "react";
import { DeployProps } from "../types/launch.types";
import { setErrorModal } from "../../../../redux/reducers/errorModalSlice";
import validateObject from "../../../../lib/lens/helpers/validatePostInfo";
import getRandomElement from "../../../../lib/lens/helpers/getRandomElement";

const Deploy: FunctionComponent<DeployProps> = ({
  grantStage,
  setGrantStage,
  dispatch,
  postInformation,
  setPostInformation,
}): JSX.Element => {
  return (
    <div className="absolute w-fit h-fit flex flex-row items-center justify-end gap-2 p-2 text-xxs bottom-2 right-3">
      {grantStage !== 6 && (
        <div
          className={`relative w-fit h-8 text-white font-dog items-center px-1.5 justify-center flex bg-mar border border-white rounded-md ${
            grantStage === 0 ? "opacity-60" : "cursor-pointer active:scale-95"
          }`}
          onClick={() => grantStage !== 0 && setGrantStage(grantStage - 1)}
        >
          {`<<<`}
        </div>
      )}
      <div
        className={`relative w-40 h-8 bg-viol border border-white rounded-md items-center justify-center px-1.5 flex ${
          grantStage === 5 ? "opacity-60" : "cursor-pointer active:scale-95"
        }`}
        onClick={() => {
          if (grantStage !== 5) {
            if (!validateObject(postInformation) && grantStage === 4) {
              dispatch(
                setErrorModal({
                  actionValue: true,
                  actionMessage:
                    "Missing Fields. Fill out all of your Grant Info before continuing!",
                })
              );
            } else {
              if (grantStage === 3) {
                const strings = getRandomElement();
                setPostInformation({
                  ...postInformation,
                  milestones: postInformation.milestones.map(
                    (milestone, index) => ({
                      ...milestone,
                      image: strings[index % 3],
                    })
                  ),
                });
              }
              setGrantStage(grantStage + 1);
            }
          }
        }}
      >
        <div className={`relative w-fit h-fit text-center font-dog text-white`}>
          Continue
        </div>
      </div>
    </div>
  );
};

export default Deploy;
