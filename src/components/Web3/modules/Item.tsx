import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Interactions from "@/components/Grants/modules/Interactions";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import Bar from "@/components/Common/modules/Bar";
import { GrantItemProps } from "../types/web3.types";
import { Profile } from "../../../../graphql/generated";

const GrantItem: FunctionComponent<GrantItemProps> = ({
  grant,
  index,
  like,
  mirror,
  bookmark,
  dispatch,
  router,
  interactionsLoading,
  setMirrorChoiceOpen,
  mirrorChoiceOpen,
  showFundedHover,
  setShowFundedHover,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-center justify-center gap-2">
      <div className="relative w-full h-fit flex flex-col items-center justify-center">
        <Bar
          title={
            grant?.grantMetadata?.title?.length > 8
              ? grant?.grantMetadata?.title?.slice(0, 6) + "..."
              : grant?.grantMetadata?.title
          }
          link={`/grant/${grant?.publication?.id}`}
          router={router}
        />
        <div className="relative w-full h-60 border border-viol rounded-sm bg-offBlack p-1">
          <div
            className="relative w-full h-full rounded-sm flex items-center justify-center cursor-pointer"
            onClick={() => router.push(`/grant/${grant?.publication?.id}`)}
          >
            {grant?.grantMetadata?.cover && (
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${
                  grant?.grantMetadata?.cover?.split("ipfs://")?.[1]
                }`}
                layout="fill"
                objectFit="cover"
                className="rounded-sm"
              />
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-offBlack flex"></div>
          </div>
          <div className="absolute bottom-2 left-2 w-full h-fit flex flex-row justify-start items-center overflow-x-scroll">
            <div className="relative w-fit h-fit flex justify-start items-center flex-row gap-2">
              {grant?.grantees?.map((item: Profile, index: number) => {
                const pfp = createProfilePicture(item?.metadata?.picture);
                return (
                  <div
                    key={index}
                    className="relative w-10 h-10 flex items-center justify-center bg-offBlack rounded-full border border-viol cursor-pointer active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      router.push(
                        `/grantee/${
                          item?.handle?.suggestedFormatted?.localName?.split(
                            "@"
                          )?.[1]
                        }`
                      );
                    }}
                    title={item?.handle?.suggestedFormatted?.localName}
                  >
                    {pfp && (
                      <Image
                        draggable={false}
                        className="rounded-full"
                        src={pfp}
                        layout="fill"
                        objectFit="cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`relative w-full h-8 bg-lima/75 border border-lima flex rounded-lg`}
      >
        <div
          className={`relative h-full cursor-pointer bg-mar/75 flex ${
            grant?.totalFundedUSD / grant?.totalGoalUSD >= 100
              ? "rounded-lg"
              : "rounded-l-lg"
          }`}
          style={{
            width: `${grant?.totalFundedUSD / grant?.totalGoalUSD}%`,
          }}
          onMouseOver={() =>
            setShowFundedHover((prev) => {
              const arr = [...prev];
              arr[index] = true;
              return arr;
            })
          }
          onMouseLeave={() =>
            setShowFundedHover((prev) => {
              const arr = [...prev];
              arr[index] = false;
              return arr;
            })
          }
        ></div>
        {showFundedHover && (
          <div className="absolute flex items-center justify-center -top-6 right-auto bg-mar/80 border text-super px-1 py-1.5 border-lima text-white font-dog rounded-md z-10">
            {`${(grant?.totalFundedUSD / grant?.totalGoalUSD).toFixed(
              2
            )}% Funded`}
          </div>
        )}
      </div>
      <Interactions
        like={like}
        mirror={mirror}
        interactionsLoading={interactionsLoading}
        dispatch={dispatch}
        bookmark={bookmark}
        post={grant?.publication!}
        router={router}
        mirrorChoiceOpen={mirrorChoiceOpen}
        setMirrorChoiceOpen={setMirrorChoiceOpen}
        index={index}
      />
    </div>
  );
};

export default GrantItem;
