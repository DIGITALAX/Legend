import { FunctionComponent } from "react";
import { BarProps } from "../types/common.types";

const Bar: FunctionComponent<BarProps> = ({
  title,
  link,
  router,
}): JSX.Element => {
  return (
    <div
      className="relative w-full min-w-fit h-8 flex flex-row items-center justify-between p-1.5 font-dog gap-2"
      id="bar"
    >
      <div className="relative p-1 whitespace-nowrap bg-offWhite/70 text-black items-center justify-start flex text-xxs w-fit h-fit">
        {title}
      </div>
      <div className="relative w-fit h-fit flex flex-row gap-1 items-center justify-end">
        <div className="relative w-5 h-5 rounded-sm bg-naran border border-black text-center items-center justify-center flex text-xxs">
          x
        </div>
        <div className="relative w-5 h-5 rounded-sm bg-amar border border-black text-center items-center justify-center flex text-xxs">
          -
        </div>
        <div
          className={`relative w-5 h-5 rounded-sm bg-azul border border-black p-1 items-center justify-center flex ${
            link && "cursor-pointer active:scale-95"
          }`}
          onClick={() =>
            link &&
            (link.includes("https")
              ? window.open(link)
              : router && router.push(link))
          }
        >
          <div className="relative border border-black items-center justify-center flex bg-white w-full h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Bar;
