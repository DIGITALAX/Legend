import { FunctionComponent } from "react";
import { RegisterAndPostProps } from "../types/launch.types";
import { AiOutlineLoading } from "react-icons/ai";
import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const RegisterAndPost: FunctionComponent<RegisterAndPostProps> = ({
  handlePostGrant,
  postLoading,
  handleLensSignIn,
  openConnectModal,
  profileId,
  connected,
  signInLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full md:w-3/5 min-w-fit h-fit bg-offWhite flex flex-col rounded-b-sm items-center justify-center">
      <Bar title={`Post Grant`} />
      <div className="relative p-2 flex w-full flex-col items-center justify-center gap-10 border border-black rounded-b-sm h-full font-dog">
        <div className="relative w-full sm:w-3/5 h-60 rounded-sm border border-black">
          <Image
            layout="fill"
            draggable={false}
            src={`${INFURA_GATEWAY}/ipfs/QmZtbRMbiQk6RjFzgLM7LYtxjF2XNhR8saxo3utJQVbuXK`}
            className="rounded-sm"
            objectFit="cover"
          />
        </div>
        <div className="relative w-3/5 h-fit flex flex-col items-center justify-end gap-3 p-2 text-xxs">
          <div className="relative w-fit h-fit flex items-center justify-center text-center">
            Ready to Go Live?
          </div>
          <div
            className={`relative w-40 h-8 bg-viol border border-white rounded-md items-center justify-center flex px-1.5 cursor-pointer active:scale-95`}
            onClick={() =>
              !connected
                ? openConnectModal
                : connected && !profileId
                ? handleLensSignIn()
                : handlePostGrant()
            }
          >
            <div
              className={`relative w-fit h-fit text-center text-white ${
                postLoading && "animate-spin"
              }`}
            >
              {postLoading || signInLoading ? (
                <AiOutlineLoading size={15} color={"white"} />
              ) : !connected ? (
                "Connect"
              ) : connected && !profileId ? (
                "Sign In"
              ) : (
                "Post Grant"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAndPost;
