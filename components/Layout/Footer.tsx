import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const Footer: FunctionComponent = (): JSX.Element => {
  return (
    <div className="w-full flex flex-col items-end justify-end fixed bottom-0 z-0">
      <div className="relative flex w-96 h-60 items-end justify-end">
        {/* <Image
          src={`${INFURA_GATEWAY}/QmRaWoW8dZk7qMveU8nSPb63kcBFBnW9odjAyHyzL5A7Es`}
          layout="fill"
          draggable={false}
        /> */}
      </div>
    </div>
  );
};

export default Footer;
