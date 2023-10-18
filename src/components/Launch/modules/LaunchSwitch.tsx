import { FunctionComponent } from "react";
import Information from "./Information";
import Milestone from "./Milestone";
import Grantees from "./Grantees";
import RegisterAndPost from "./RegisterAndPost";
import Preview from "./Preview";
import CollectionShuffle from "./CollectionShuffle";
import { LaunchSwitchProps } from "../types/launch.types";
import Success from "./Success";

const LaunchSwitch: FunctionComponent<LaunchSwitchProps> = ({
  grantStage,
  postInformation,
  setPostInformation,
  imageLoading,
  handleImageUpload,
  dateOpen,
  setDateOpen,
  claimMilestoneLoading,
  inputDateValue,
  selectedDate,
  handleDateSelect,
  handleInputDateChange,
  handleActivateMilestone,
  activateMilestoneLoading,
  handleClaimMilestone,
  postLoading,
  grantPosted,
  grantRegistered,
  handlePostGrant,
  handleRegisterGrant,
  registerLoading,
  grantStageLoading,
  handleShuffleCollectionLevels,
  router,
  pubId,
  profileId,
  openConnectModal,
  handleLensSignIn,
  connected,
  signInLoading,
  priceIndex,
  setPriceIndex,
  levelArray
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
        <div className="relative flex flex-row w-full h-full gap-3">
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
                handleActivateMilestone={handleActivateMilestone}
                handleClaimMilestone={handleClaimMilestone}
                activateMilestoneLoading={activateMilestoneLoading}
                claimMilestoneLoading={claimMilestoneLoading}
                postInformation={postInformation}
                setPostInformation={setPostInformation}
              />
            );
          })}
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
          handleShuffleCollectionLevels={handleShuffleCollectionLevels}
          levelArray={levelArray}
          grantStageLoading={grantStageLoading}
          priceIndex={priceIndex}
          setPriceIndex={setPriceIndex}
        />
      );
    case 4:
      return (
        <Preview
          postInformation={postInformation}
          grantStageLoading={grantStageLoading}
          levelArray={levelArray}
          setPostInformation={setPostInformation}
          priceIndex={priceIndex}
          setPriceIndex={setPriceIndex}
        />
      );

    case 5:
      return (
        <RegisterAndPost
          postLoading={postLoading}
          registerLoading={registerLoading}
          signInLoading={signInLoading}
          grantPosted={grantPosted}
          grantRegistered={grantRegistered}
          handleRegisterGrant={handleRegisterGrant}
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
