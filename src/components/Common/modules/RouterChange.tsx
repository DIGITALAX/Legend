import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const RouterChange: FunctionComponent = (): JSX.Element => {

  return (
    <div
    className="relative w-screen h-screen flex bg-[#7b00ff80]/40 justify-center items-center"
    id="router"
  >
    <div className="relative flex justify-center items-center flex-col gap-4">
      <div className="w-16 h-16 relative flex items-center justify-center animate-bounce">
        <Image
          layout="fill"
          priority
          draggable={false}
          src={`${INFURA_GATEWAY}/ipfs/QmaNSeDzB9Yf4c9tbXF8ikoen4wgUqY1ZmuTswnf2kWgzK`}
        />
      </div>
    </div>
  </div>
  );
};

export default RouterChange;
