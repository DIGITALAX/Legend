import { FunctionComponent } from "react";
import { LevelInfo, Milestone, PreviewProps } from "../types/launch.types";
import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS,
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import CollectItem from "../../Common/modules/CollectItem";
import LevelOne from "./LevelOne";

const Preview: FunctionComponent<PreviewProps> = ({
  postInformation,
  levelArray,
  details,
  setDetails,
  oracleData,
  dispatch
}): JSX.Element => {
  return (
    <div
      className="relative flex flex-col w-full xl:w-3/5 h-full overflow-y-scroll justify-start items-start"
      id="milestone"
    >
      <div className="relative w-full h-fit flex flex-col gap-4 items-start justify-start">
        <div className="relative w-full h-fit flex flex-col items-start justify-start min-w-fit">
          <Bar title="Grant Preview" />
          <div className="relative bg-offWhite w-full h-fit flex flex-col items-center justify-start p-3 gap-6 border border-black rounded-b-sm min-w-fit">
            <div className="relative w-full h-fit flex items-center justify-center text-center">
              <div className="bg-offWhite text-center flex items-center justify-center font-dog break-all text-black text-sm">
                {postInformation?.title}
              </div>
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-5 w-full h-48">
              <div className="relative w-full md:w-fit h-full flex items-center justify-center">
                <div className="relative w-full md:w-48 h-full flex items-center justify-center border border-black rounded-sm">
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/${postInformation?.coverImage}`}
                    className="relative rounded-sm w-full h-full flex"
                    objectFit="cover"
                  />
                </div>
              </div>
              <div className="relative w-full h-full flex items-start justify-center">
                <div className="bg-offWhite w-full h-full border border-black p-2 rounded-sm font-dog text-black text-xs overflow-y-scroll">
                  {postInformation?.description}
                </div>
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col tablet:flex-row items-start justify-start gap-4">
              <div className="relative flex flex-col justify-start items-start w-full h-full font-dog text-black text-xs gap-2">
                <div className="relative w-fit  break-all h-fit flex justify-start items-start">
                  Maintenance Strategy
                </div>
                <div className="relative w-full h-44 flex">
                  <div className="bg-offWhite w-full h-full break-all border border-black p-2 rounded-sm overflow-y-scroll">
                    {postInformation?.strategy}
                  </div>
                </div>
              </div>
              <div className="relative flex flex-col justify-start items-start w-full h-full font-dog text-black text-xs gap-2">
                <div className="relative w-fit h-fit  break-all flex justify-start items-start">
                  Tech Stack
                </div>
                <div className="relative w-full h-44 flex">
                  <div className="bg-offWhite  break-all w-full h-full border border-black p-2 rounded-sm overflow-y-scroll">
                    {postInformation?.tech}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col tablet:flex-row items-start justify-start gap-4">
              <div className="relative flex flex-col justify-start items-start w-full h-full font-dog text-black text-xs gap-2">
                <div className="relative break-all w-fit h-fit flex justify-start items-start">
                  Team Experience
                </div>
                <div className="relative w-full h-48">
                  <div className="bg-offWhite break-all w-full h-full border border-black p-2 rounded-sm overflow-y-scroll">
                    {postInformation?.experience}
                  </div>
                </div>
              </div>
              <div className="relative flex flex-col justify-start items-start w-full h-full font-dog text-black text-xs gap-2">
                <div className="relative break-all w-fit h-fit flex justify-start items-start">
                  Who&apos;s Involved
                </div>
                <div className="relative w-full h-48">
                  <div className="bg-offWhite break-all w-full h-full border border-black p-2 rounded-sm overflow-y-scroll">
                    {postInformation?.team}
                  </div>
                </div>
              </div>
              <div className="relative flex flex-col justify-start items-start w-full h-fit font-dog text-black text-xs gap-2">
                <div className="relative w-fit break-all h-fit flex justify-start items-start">
                  Grantees
                </div>
                <div className="relative w-full h-fit flex flex-row items-center justify-start gap-1.5">
                  <div className="relative w-full sm:w-56 flex flex-col gap-2 items-center justify-center overflow-y-scroll">
                    {postInformation.grantees?.map(
                      (address: string, index: number) => {
                        return (
                          <div
                            id="side"
                            key={index}
                            className="bg-offWhite text-black font-dog flex items-center justify-start px-1.5 py-1 text-center border border-black overflow-x-scroll break-all rounded-sm h-7 w-full"
                          >
                            {address}
                          </div>
                        );
                      }
                    )}
                  </div>
                  <div className="relative w-12 flex flex-col gap-2 items-center justify-center overflow-y-scroll">
                    {postInformation.splits?.map(
                      (split: number, index: number) => {
                        return (
                          <div
                            id="side"
                            key={index}
                            className="bg-offWhite text-black font-dog flex items-center justify-start px-1.5 py-1 text-center border border-black overflow-x-scroll rounded-sm h-7 w-full"
                          >
                            {split}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex w-full h-fit">
          <div className="relative w-full h-fit flex flex-col md:flex-row gap-3">
            {postInformation.milestones?.map(
              (milestone: Milestone, index: number) => {
                return (
                  <div
                    className="relative w-full h-full bg-offWhite flex flex-col rounded-b-sm"
                    key={index}
                  >
                    <Bar title={`Milestone ${index + 1}`} />
                    <div className="relative p-2 flex w-full flex-col items-center justify-center gap-4 border border-black rounded-b-sm h-full">
                      <div className="relative w-full h-40 rounded-sm">
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/${milestone.image}`}
                          draggable={false}
                          objectFit="cover"
                        />
                      </div>
                      <div className="relative flex flex-col items-start justify-center gap-1 w-full h-fit">
                        <div className="relative font-dog text-black text-xxs items-start justify-center w-fit h-fit">
                          {`Milestone Goal:`}
                        </div>
                        <div className="relative w-full h-fit flex gap-2 flex-col items-start justify-center">
                          {postInformation?.currencies?.map(
                            (currency: string, indexTwo: number) => {
                              return (
                                <div
                                  className="relative w-full h-fit flex flex-row items-center justify-start gap-2"
                                  key={indexTwo}
                                >
                                  <div className="relative w-fit h-fit flex items-center justify-center">
                                    <div
                                      className={`relative w-5 h-6 rounded-full flex items-center`}
                                    >
                                      <Image
                                        src={`${INFURA_GATEWAY}/ipfs/${
                                          ACCEPTED_TOKENS.find(
                                            (item) => item[2] == currency
                                          )?.[0]
                                        }`}
                                        className="flex"
                                        draggable={false}
                                        width={30}
                                        height={35}
                                      />
                                    </div>
                                  </div>
                                  <input
                                    type="number"
                                    className="w-full h-8 bg-offWhite border border-black text-xxs text-black font-dog p-1 flex items-center break-all justify-center rounded-sm"
                                    disabled
                                    value={
                                      postInformation?.milestones[index]
                                        ?.currencyAmount?.[
                                        postInformation?.milestones[
                                          index
                                        ]?.currencyAmount?.findIndex(
                                          (item) => item.currency == currency
                                        )
                                      ]?.goal
                                    }
                                  />
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                      <div
                        className="relative w-full h-72 border border-black rounded-sm items-center justify-center flex overflow-y-scroll bg-quemo"
                        id="milestone"
                      >
                        <div className="break-words p-2 text-amar font-dog text-xxs flex w-full h-full rounded-sm">
                          {milestone.description}
                        </div>
                      </div>
                      <div className="relative flex flex-col items-start justify-end gap-1 w-full h-fit">
                        <div className="relative font-dog text-black text-xxs items-start justify-center w-fit h-fit">
                          Submit By:
                        </div>
                        <div className="relative flex flex-row items-start justify-center gap-1">
                          <div className="relative w-fit h-fit flex items-center justify-center gap-2">
                            <div className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit">
                              <div className="w-24 h-8 bg-quemo text-xxs text-amar font-dog p-1 flex items-center justify-center">
                                {milestone?.submit}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div
          className="relative flex w-full h-fit overflow-x-scroll"
          id="milestone"
        >
          <div className="relative w-fit h-fit flex flex-row gap-3">
            <LevelOne
              details={details?.[0]?.[0]}
              setDetails={setDetails}
              mainIndex={0}
              oracleData={oracleData}
              acceptedTokens={postInformation?.currencies}
            />
            {levelArray?.map((levelInfo: LevelInfo, index: number) => {
              return (
                <CollectItem
                  key={index}
                  levelInfo={levelInfo}
                  details={details?.[0]?.[levelInfo.level - 1]}
                  oracleData={oracleData}
                  setDetails={setDetails}
                  mainIndex={0}
                  dispatch={dispatch}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
