import { FunctionComponent } from "react";
import { EditProps } from "../types/grantee.types";
import Image from "next/legacy/image";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import moment from "moment";
import { Milestone } from "@/components/Grants/types/grant.types";
import { AiOutlineLoading } from "react-icons/ai";

const Edit: FunctionComponent<EditProps> = ({
  grant,
  handleClaimMilestone,
  milestoneClaimLoading,
  router,
  showFundedHover,
  setShowFundedHover,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex items-start justify-start flex-col gap-6">
      <div className="relative w-full h-fit flex items-center justify-center text-xs font-dog text-white">
        {grant?.grantMetadata?.title}
      </div>
      <div className="relative flex flex-col items-center justify-center w-full h-fit gap-2 pb-5">
        <div className="relative w-full h-fit flex items-center justify-center flex-col">
          <div className="relative flex items-center justify-center bg-mar/80 rounded- border text-super px-1 py-1.5 border-lima text-white font-dog rounded-x-md rounded-t-md z-10 w-full h-fit">
            {`${(grant?.totalFundedUSD / grant?.totalGoalUSD).toFixed(
              5
            )}% Funded`}
          </div>
          <div
            className={`relative w-full h-8 bg-lima/75 border border-lima flex rounded-x-md rounded-b-md`}
          >
            <div
              className={`relative h-full ${
                grant?.totalFundedUSD / grant?.totalGoalUSD >= 100
                  ? "rounded-md"
                  : "rounded-l-md"
              } bg-mar/75 flex`}
              style={{
                width: `${grant?.totalFundedUSD / grant?.totalGoalUSD}%`,
              }}
            ></div>
          </div>
        </div>
        <div
          className="relative w-full h-fit flex p-2 flex-row flex-wrap gap-2 bg-offBlack border border-lima rounded-ms max-h-[10rem] min-h-[4rem] overflow-y-scroll items-start justify-start"
          id="side"
        >
          {grant?.funders?.map((funder, index: number) => {
            const pfp = createProfilePicture(
              funder?.profile?.metadata?.picture
            );
            return (
              <div
                key={index}
                className="relative w-fit h-fit flex items-center justify-center"
              >
                <div
                  className="relative w-8 h-8 border border-lima rounded-full flex items-center justify-center bg-mar/75 cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/grantee/${
                        funder?.profile?.handle?.suggestedFormatted?.localName?.split(
                          "@"
                        )?.[1]
                      }`
                    )
                  }
                  title={`$${(Number(funder.usdAmount) / 10 ** 36)?.toFixed(
                    4
                  )} Contributed`}
                >
                  {pfp && (
                    <Image
                      draggable={false}
                      objectFit="cover"
                      className="rounded-full"
                      src={pfp}
                      layout="fill"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-col items-start justify-start gap-7">
        {grant?.milestones?.map((milestone: Milestone, index: number) => {
          return (
            <div
              key={index}
              className="relative w-full h-fit flex sm:flex-nowrap flex-wrap flex-col gap-4 justify-start items-start"
            >
              <div className="relative w-full h-fit flex items-start justify-between gap-4 flex-row">
                <div className="relative w-fit h-fit flex items-start justify-center gap-2 flex-row ml-0">
                  <div className="relative w-fit h-fit flex items-start justify-start font-dog text-xxs text-white">{`Milestone ${
                    index + 1
                  }`}</div>
                  <div className="relative w-fit h-fit flex items-start justify-start top-px font-dog text-super text-white">
                    {milestone.submitBy &&
                      `(${moment(
                        Number(milestone.submitBy) * 1000
                      ).fromNow()})`}
                  </div>
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center mr-0">
                  <div
                    className={`relative w-24 h-7 flex items-center justify-center rounded-sm border border-white px-1.5 py-1 font-dog text-super text-white ${
                      milestoneClaimLoading
                        ? "animate-spin"
                        : milestone.allClaimed ||
                          milestone.granteeClaimed ||
                          Math.floor(Date.now() / 1000) <
                            Number(milestone.submitBy) - 2 * 7 * 24 * 60 * 60 ||
                          Math.floor(Date.now() / 1000) >
                            Number(milestone.submitBy) + 2 * 7 * 24 * 60 * 60
                        ? "opacity-70"
                        : "cursor-pointer active:scale-95"
                    }`}
                    onClick={() =>
                      !milestoneClaimLoading &&
                      !milestone.allClaimed &&
                      !milestone.granteeClaimed &&
                      handleClaimMilestone(index + 1)
                    }
                  >
                    {milestoneClaimLoading ? (
                      <AiOutlineLoading color={"white"} size={12} />
                    ) : milestone?.allClaimed ? (
                      "All Claimed"
                    ) : milestone?.granteeClaimed ? (
                      "Claimed"
                    ) : (
                      "Claim"
                    )}
                  </div>
                </div>
              </div>
              {milestone.currencyGoal?.map(
                (
                  currency: {
                    currency: string;
                    amount: string;
                  },
                  indexTwo: number
                ) => {
                  return (
                    <div
                      className="relative flex flex-row gap-3 items-start justify-start w-full h-fit"
                      key={indexTwo}
                    >
                      <div className="relative w-fit flex items-start justify-start flex-row gap-1.5 h-fit">
                        <div className="w-fit h-fit relative flex items-center justify-center gap-2">
                          <div
                            className={`relative w-5 h-6 rounded-full flex items-center cursor-pointer active:scale-95`}
                          >
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/${
                                ACCEPTED_TOKENS_MUMBAI.find(
                                  (t) => t[2] == currency.currency
                                )?.[0]
                              }`}
                              className="flex"
                              draggable={false}
                              layout="fill"
                            />
                          </div>
                        </div>
                        <div className="relative w-fit h-fit flex flex-row justify-start items-center text-white gap-1.5">
                          <div className="relative w-fit h-fit flex items-center justify-center whitespace-nowrap font-gam text-lg">
                            Contribution Goal:
                          </div>
                          <div className="relative w-fit h-fit flex items-center justify-center font-dog text-super top-px whitespace-nowrap">
                            {(Number(currency.amount) / 10 ** 18).toFixed(2)}{" "}
                            {
                              ACCEPTED_TOKENS_MUMBAI.find(
                                (token) => token[2] == currency.currency
                              )?.[1]
                            }
                          </div>
                        </div>
                      </div>
                      <div
                        className={`relative w-full h-6 bg-lima/75 border border-lima cursor-pointer flex rounded-md`}
                        onMouseEnter={() =>
                          setShowFundedHover((prev) => {
                            const arr = [...prev];

                            arr[index][indexTwo] = true;

                            return arr;
                          })
                        }
                        onMouseLeave={() =>
                          setShowFundedHover((prev) => {
                            const arr = [...prev];

                            arr[index][indexTwo] = false;

                            return arr;
                          })
                        }
                      >
                        <div
                          className={`relative h-full ${
                            Number(
                              grant?.fundedAmount?.find(
                                (item) => item.currency == currency.currency
                              )?.funded
                            ) /
                              Number(currency.amount) >=
                            100
                              ? "rounded-md"
                              : "rounded-l-md"
                          } bg-mar/75 flex`}
                          style={{
                            width: `${
                              Number(
                                grant?.fundedAmount?.find(
                                  (item) => item.currency == currency.currency
                                )?.funded
                              ) / Number(currency.amount)
                            }%`,
                          }}
                        ></div>
                        {showFundedHover?.[index]?.[indexTwo] && (
                          <div className="absolute flex items-center justify-center -top-6 right-auto bg-mar/80 border text-super px-1 py-1.5 border-lima text-white font-dog rounded-md z-10">
                            {`${(
                              Number(
                                grant?.fundedAmount?.find(
                                  (item) => item.currency == currency.currency
                                )?.funded
                              ) / Number(currency.amount)
                            ).toFixed(5)}% Funded`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
              <div className="relative w-full h-px flex items-center justify-center bg-white/70"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Edit;
