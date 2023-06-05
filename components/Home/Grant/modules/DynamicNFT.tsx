import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const DynamicNFT: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-98 h-100 rounded-md bg-gris top-10 flex flex-col p-3 gap-5">
      <div className="relative w-full h-full border-2 border-rosa">
        <Image src={`${INFURA_GATEWAY}/`} layout="fill" objectFit="cover" />
      </div>
      <div className="relative bg-purp border-2 border-rosa w-full h-16"></div>
    </div>
  );
};

export default DynamicNFT;
