import { FunctionComponent } from "react";
import { SplitsProps } from "../types/launch.types";

const Splits: FunctionComponent<SplitsProps> = ({
  designer,
  fulfiller,
  grantee,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit flex flex-row items-start justify-center text-left break-words gap-3 text-black text-xxs font-vcr">
      {[
        {
          name: "You",
          amount: grantee,
        },
        {
          name: "Designer",
          amount: designer,
        },
        {
          name: "Fulfiller",
          amount: fulfiller,
        },
      ].map(
        (
          item: {
            name: string;
            amount: number;
          },
          index: number
        ) => {
          return (
            <div
              key={index}
              className="relative w-fit h-fit flex items-center justify-center flex flex-row break-words gap-1"
            >
              <div className="relative w-fit h-fit items-center justify-center">
                {item.name}
              </div>
              <div className="relative w-fit h-fit items-center justify-center">
                {item.amount}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default Splits;
