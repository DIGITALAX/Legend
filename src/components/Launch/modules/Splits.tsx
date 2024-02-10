import { FunctionComponent } from "react";
import { SplitsProps } from "../types/launch.types";
import getSplits from "../../../../lib/lens/helpers/getSplits";

const Splits: FunctionComponent<SplitsProps> = ({
  onlyGrantee,
  price,
  fBase,
  fPercent,
  dPercent
}): JSX.Element => {
  const { grantee, designer, fulfiller } = getSplits(price, fPercent, fBase, dPercent);
  return (
    <div className="relative w-fit h-fit flex flex-row items-start justify-center text-left break-words gap-3 text-black text-xxs font-vcr">
      {(onlyGrantee
        ? [
            {
              name: "You",
              amount: grantee,
            },
          ]
        : [
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
          ]
      ).map(
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
              <div className="relative w-fit h-fit items-center justify-center text-enferm">
                {item.amount}%
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default Splits;
