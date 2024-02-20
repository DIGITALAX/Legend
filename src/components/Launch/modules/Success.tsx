import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Bar from "@/components/Common/modules/Bar";
import { SuccessProps } from "../types/launch.types";

const Success: FunctionComponent<SuccessProps> = ({
  router,
  pubId,
}): JSX.Element => {
  return (
    <div className="relative w-full md:w-3/5 h-fit bg-offWhite flex flex-col rounded-b-sm items-center justify-center">
      <Bar title={`Grant Live`} />
      <div className="relative p-2 flex w-full flex-col items-center justify-center gap-10 border border-black rounded-b-sm h-full font-dog">
        <div className="relative w-full sm:w-3/5 h-60 rounded-sm border border-black">
          <Image
            layout="fill"
            draggable={false}
            src={`${INFURA_GATEWAY}/ipfs/QmbUkJRBMqmNSRjjrAZrxrpFhuZrKoHQJsi7fqLz5Lz3om`}
            className="rounded-sm"
            objectFit="cover"
          />
        </div>

        <div className="relative w-3/5 h-fit flex flex-col items-center justify-end gap-3 p-2 text-xxs">
          <div className="relative w-fit h-fit flex items-center justify-center text-center">
            Congrats! Your Grant is Live!
          </div>
          <div
            className={`relative w-40 h-8 bg-viol border border-white rounded-md items-center justify-center px-1.5 flex cursor-pointer active:scale-95`}
            onClick={() => router.push(`/grant/${pubId}`)}
          >
            <div
              className={`relative w-fit h-fit text-center font-dog text-white`}
            >
              Go to Grant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
