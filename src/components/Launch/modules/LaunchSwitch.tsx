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
  inputDateValue,
  selectedDate,
  handleDateSelect,
  handleInputDateChange,
  postLoading,
  grantPosted,
  grantRegistered,
  handlePostGrant,
  handleRegisterGrant,
  registerLoading,
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
  indexes,
  handleChangeCurrency,
  handleChangeImage,
  handleChangeItem,
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
        <div className="relative flex flex-row w-full h-full gap-3 overflow-x-scroll" id="milestone">
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
          allCollectionsLoading={allCollectionsLoading}
          indexes={indexes}
          handleChangeCurrency={handleChangeCurrency}
          handleChangeImage={handleChangeImage}
          handleChangeItem={handleChangeItem}
        />
      );
    case 4:
      return (
        <Preview
          postInformation={postInformation}
          levelArray={levelArray}
          indexes={indexes}
          handleChangeCurrency={handleChangeCurrency}
          handleChangeImage={handleChangeImage}
          handleChangeItem={handleChangeItem}
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
