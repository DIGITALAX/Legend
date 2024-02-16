import { FunctionComponent } from "react";
import { AccountProps } from "../types/grantee.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import Bar from "@/components/Common/modules/Bar";
import { AiOutlineLoading } from "react-icons/ai";

const Account: FunctionComponent<AccountProps> = ({
  granteeLoading,
  profile,
  followLoading,
  followProfile,
  unfollowProfile,
}): JSX.Element => {
  const pfp = createProfilePicture(profile?.metadata?.picture);
  return (
    <div className="relative w-full h-80 rounded-md flex items-center justify-center flex-col">
      <Bar title={profile?.handle?.suggestedFormatted?.localName!} contain />
      <div className="relative top-0 left-0 flex rounded-md w-full h-full bg-offBlack">
        {
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              profile?.metadata?.coverPicture?.raw?.uri?.split(
                "ipfs://"
              )?.[1] || "QmZ1rr7j8U82AmrngfN2zejs7pmet5nCTxeXVgHgA9AKzf"
            }`}
            draggable={false}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        }
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent flex to-black"></div>
      </div>
      <div className="absolute bottom-14 right-6 w-fit h-fit flex items-center justify-end mr-0">
        <div className="rounded-full flex items-center relative w-24 h-24 border border-mar/75">
          {pfp && (
            <Image
              src={pfp}
              layout="fill"
              className="rounded-full"
              draggable={false}
              objectFit="cover"
            />
          )}
        </div>
      </div>
      <div className="absolute w-fit h-fit flex items-center justify-center top-10 left-2">
        <div
          className={`relative rounded-md border border-lima bg-mar/75 text-lima font-dog text-super w-20 h-7 flex items-center justify-center hover:opacity-70 opacity-90 ${
            !followLoading && "cursor-pointer active:scale-95"
          }`}
          onClick={() =>
            !followLoading &&
            (profile?.operations?.isFollowedByMe?.value
              ? followProfile()
              : unfollowProfile())
          }
        >
          <div
            className={`relative ${
              followLoading && "animate-spin"
            } flex items-center justify-center`}
          >
            {followLoading ? (
              <AiOutlineLoading color="#CAED00" size={12} />
            ) : profile?.operations?.isFollowedByMe?.value ? (
              "Unfollow"
            ) : (
              "Follow"
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 left-2 w-fit h-fit flex items-center justify-end ml-0 flex-row gap-5">
        <div className="relative w-fit h-fit flex flex-row items-center justify-center gap-1.5">
          <div
            className="relative w-8 h-8 flex items-center justify-center"
            title="Followers"
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmZQRHSX1TFjrRNJR5UqYGLr4kAiZdBpGSTeHJ5fNetVFu`}
              layout="fill"
              draggable={false}
            />
          </div>
          <div className="relative w-fit h-fit text-white font-dog text-xs flex items-center justify-center">
            {profile?.stats?.followers}
          </div>
        </div>
        <div className="relative w-fit h-fit flex flex-row items-center justify-center gap-1.5">
          <div
            className="relative w-7 h-7 flex items-center justify-center"
            title="Following"
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmVNYCPQE1vqYzLhxUn5gN1t5groTQsabDg3fdPwAubwvf`}
              layout="fill"
              draggable={false}
            />
          </div>
          <div className="relative w-fit h-fit text-white font-dog text-xs flex items-center justify-center">
            {profile?.stats?.following}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
