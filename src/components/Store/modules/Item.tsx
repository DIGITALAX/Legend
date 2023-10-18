import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { ItemProps } from "../types/store.types";
import Link from "next/link";

const Item: FunctionComponent<ItemProps> = ({ grant }): JSX.Element => {
  return (
    <Link
      href={`/grant/${grant?.id}`}
      className="relative w-80 h-60 flex flex-col items-center justify-center gap-4"
    >
      <div className="relative w-full h-full border-2 border-viol bg-offWhite">
        <Image src={`${INFURA_GATEWAY}/ipfs/${grant?.image}`} layout="fill" />
      </div>
      <div
        className="relative w-full h-12 flex flex-row justify-between items-center gap-8 p-1"
        id="bar"
      >
        <div className="relative w-fit h-fit flex items-center justify-center">
          <div className="relative w-6 h-6 rounded-full border border-viol bg-white">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${grant?.profileImage}`}
              layout="fill"
            />
          </div>
        </div>
        <div className="relative w-full h-full flex flex-col gap-1.5 bg-offWhite/40 justify-center items-start border border-black font-gam">
          <div className="relative w-fit h-fit text-black text-xs">
            {grant?.apparelName}
          </div>
          <div className="relative w-fit h-fit text-suelo text-xxs">
            {grant?.name}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Item;
