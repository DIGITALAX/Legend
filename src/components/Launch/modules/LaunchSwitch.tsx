import { FunctionComponent } from "react";
import Information from "./Information";
import Milestone from "./Milestone";
import Grantees from "./Grantees";
import RegisterAndPost from "./RegisterAndPost";
import Preview from "./Preview";
import CollectionShuffle from "./CollectionShuffle";
import { LaunchSwitchProps } from "../types/launch.types";
import Success from "./Success";
import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";

const LaunchSwitch: FunctionComponent<LaunchSwitchProps> = ({
  grantStage,
  postInformation,
  setPostInformation,
  imageLoading,
  handleImageUpload,
  dateOpen,
  setDateOpen,
  inputDateValue,
  selectedDate,
  handleDateSelect,
  handleInputDateChange,
  postLoading,
  handlePostGrant,
  allCollectionsLoading,
  handleShuffleCollectionLevels,
  router,
  pubId,
  profileId,
  openConnectModal,
  handleLensSignIn,
  connected,
  signInLoading,
  levelArray,
  details,
  setDetails,
  oracleData,
}) => {
  switch (grantStage) {
    case 0:
      return (
        <Information
          postInformation={postInformation}
          setPostInformation={setPostInformation}
          imageLoading={imageLoading}
          handleImageUpload={handleImageUpload}
        />
      );
    case 1:
      return (
        <div className="relative w-3/5 h-full flex flex-col items-center justify-center gap-6">
          <div className="relative w-full min-w-fit h-fit flex flex-col items-center justify-start">
            <Bar title="Accepted Currencies" />
            <div className="relative bg-offWhite w-full h-fit flex flex-col items-center justify-start p-3 gap-4 border border-black rounded-b-sm">
              <div className="relative text-center w-3/5 h-fit font-dog text-offBlack text-xxs break-words">
                Choose which currencies you&apos;d like to accept for Level 1
                Grant contributions.
              </div>
              <div className="relative w-3/4 justify-center items-center flex flex-row gap-5">
                {ACCEPTED_TOKENS_MUMBAI?.map(
                  (item: string[], index: number) => {
                    return (
                      <div
                        className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                          postInformation.currencies?.includes(item[2])
                            ? "opacity-50"
                            : "opacity-100"
                        }`}
                        key={index}
                        onClick={() =>
                          setPostInformation((prev) => {
                            let newInfo = {
                              ...prev,
                            };

                            let newCurrencies = prev.currencies;

                            if (newCurrencies.includes(item[2])) {
                              newCurrencies = newCurrencies
                                .filter((value) => value !== item[2])
                                .filter(Boolean);
                            } else {
                              newCurrencies = [...newCurrencies, item[2]];
                            }
                            newInfo = {
                              ...newInfo,
                              currencies: newCurrencies,
                            };

                            return newInfo;
                          })
                        }
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
                          className="flex"
                          draggable={false}
                          width={30}
                          height={35}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
          <div
            className="relative flex flex-row w-full h-full gap-3 overflow-x-scroll"
            id="milestone"
          >
            {Array.from({ length: 3 }).map((_, index: number) => {
              return (
                <Milestone
                  key={index}
                  index={index}
                  dateOpen={dateOpen}
                  setDateOpen={setDateOpen}
                  handleDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                  inputDateValue={inputDateValue}
                  handleInputDateChange={handleInputDateChange}
                  postInformation={postInformation}
                  setPostInformation={setPostInformation}
                />
              );
            })}
          </div>
        </div>
      );
    case 2:
      return (
        <Grantees
          postInformation={postInformation}
          setPostInformation={setPostInformation}
        />
      );
    case 3:
      return (
        <CollectionShuffle
          acceptedTokens={postInformation?.currencies}
          handleShuffleCollectionLevels={handleShuffleCollectionLevels}
          levelArray={levelArray}
          allCollectionsLoading={allCollectionsLoading}
          details={details}
          oracleData={oracleData}
          setDetails={setDetails}
        />
      );
    case 4:
      return (
        <Preview
          postInformation={postInformation}
          levelArray={levelArray}
          oracleData={oracleData}
          setDetails={setDetails}
          details={details}
        />
      );

    case 5:
      return (
        <RegisterAndPost
          postLoading={postLoading}
          signInLoading={signInLoading}
          handlePostGrant={handlePostGrant}
          openConnectModal={openConnectModal}
          handleLensSignIn={handleLensSignIn}
          profileId={profileId}
          connected={connected}
        />
      );

    case 6:
      return (
        <Success
          router={router}
          pubId={`${profileId}-${pubId?.toString(16)}`}
        />
      );

    default:
      return null;
  }
};

export default LaunchSwitch;
