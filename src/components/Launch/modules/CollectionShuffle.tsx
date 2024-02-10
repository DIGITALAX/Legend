import Bar from "@/components/Common/modules/Bar";
import { FunctionComponent } from "react";
import { CollectionShuffleProps, LevelInfo } from "../types/launch.types";
import CollectItem from "../../Common/modules/CollectItem";
import LevelOne from "./LevelOne";

const CollectionShuffle: FunctionComponent<CollectionShuffleProps> = ({
  levelArray,
  handleShuffleCollectionLevels,
  details,
  setDetails,
  oracleData,
}): JSX.Element => {
  return (
    <div className="relative w-3/5 h-fit flex flex-col items-center justify-center gap-6">
      <div className="relative w-full min-w-fit h-fit flex flex-col items-center justify-start">
        <Bar title="Collection Shuffle" />
        <div className="relative bg-offWhite w-full h-fit flex flex-col items-center justify-start p-3 gap-4 border border-black rounded-b-sm">
          <div className="relative text-center w-4/5 h-fit font-dog text-offBlack text-xxs break-words">
            Unlock exclusive NFT art, prints, and stylish attire. Each level
            offers a unique blend. A baseline cost and vig is earmarked for the
            creative fulfillment team behind the curtain. All surplus is
            channeled into your grant.
            <br />
            <br /> Want a fresh mix? Swap for another set.
          </div>
          <div
            className={`w-40 h-8 cursor-pointer rounded-sm cursor-pointer active:scale-95 border border-black flex items-center justify-center text-center font-gam text-xl bg-viol text-white`}
            onClick={() => handleShuffleCollectionLevels()}
          >
            Shuffle Collections
          </div>
        </div>
      </div>
      <div
        className="relative flex w-full items-center justify-start h-fit flex-row overflow-x-scroll"
        id="milestone"
      >
        <div className="relative w-fit h-full flex flex-row gap-3">
          <LevelOne
            details={details?.[0]?.[0]}
            setDetails={setDetails}
            mainIndex={0}
            oracleData={oracleData}
          />
          {levelArray?.map((levelInfo: LevelInfo, index: number) => {
            return (
              <CollectItem
                key={index}
                levelInfo={levelInfo}
                details={details?.[0]?.[levelInfo.level]}
                oracleData={oracleData}
                setDetails={setDetails}
                mainIndex={0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CollectionShuffle;
