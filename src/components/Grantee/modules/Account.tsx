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
  owner,
  setOrders,
  orders,
  edit,
  setEdit,
}): JSX.Element => {
  const pfp = createProfilePicture(profile?.metadata?.picture);
  return (
    <div className="relative w-full h-80 rounded-md flex items-center justify-center flex-col">
      <Bar title={profile?.handle?.suggestedFormatted?.localName!} contain />
      <div
        className={`relative top-0 left-0 flex rounded-md w-full h-full bg-offBlack ${
          granteeLoading && "animate-pulse"
        }`}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/${
            profile?.metadata?.coverPicture?.raw?.uri?.split("ipfs://")?.[1] ||
            "QmdJ7EuyenjWvn6LPKNsTZ26SsfBA4CZFepAM1vexHmfED"
          }`}
          draggable={false}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
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
          className={`relative rounded-sm border border-lima bg-mar/75 text-lima font-dog text-super w-[4.5rem] h-7 flex items-center justify-center hover:opacity-70 opacity-90 ${
            (owner || !followLoading) && "cursor-pointer active:scale-95"
          }`}
          onClick={() =>
            !owner
              ? !followLoading &&
                (profile?.operations?.isFollowedByMe?.value
                  ? followProfile()
                  : unfollowProfile())
              : edit
              ? setEdit(undefined)
              : setOrders(!orders)
          }
        >
          <div
            className={`relative ${
              !owner && followLoading && "animate-spin"
            } flex items-center justify-center`}
          >
            {edit || orders ? (
              "Return"
            ) : owner ? (
              "Orders"
            ) : followLoading ? (
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
            className="relative w-6 h-6 flex items-center justify-center"
            title="Followers"
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/Qmce5C1H9D4LZE6jMuxXvrmzJuARJyF3Z7c7uQCJkecf8n`}
              layout="fill"
              draggable={false}
            />
          </div>
          <div className="relative w-fit h-fit text-white font-dog text-xxs flex items-center justify-center">
            {profile?.stats?.followers}
          </div>
        </div>
        <div className="relative w-fit h-fit flex flex-row items-center justify-center gap-1.5">
          <div
            className="relative w-6 h-6 flex items-center justify-center"
            title="Following"
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmP9rMEfi3UkHMxJrCUcYuYDkhTTYAooKowah2JYxqwkW1`}
              layout="fill"
              draggable={false}
            />
          </div>
          <div className="relative w-fit h-fit text-white font-dog text-xxs flex items-center justify-center">
            {profile?.stats?.following}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
