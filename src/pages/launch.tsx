import useLaunch from "@/components/Launch/hooks/useLaunch";
import Deploy from "@/components/Launch/modules/Deploy";
import LaunchSwitch from "@/components/Launch/modules/LaunchSwitch";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useLevelItems from "@/components/Launch/hooks/useLevelItems";

export default function Launch() {
  const {
    handleInputDateChange,
    handleDateSelect,
    selectedDate,
    inputDateValue,
    dateOpen,
    setDateOpen,
    handleRegisterGrant,
    handlePostGrant,
    postLoading,
    registerLoading,
    grantPosted,
    grantRegistered,
    imageLoading,
    handleImageUpload,
    postInformation,
    setPostInformation,
    handleActivateMilestone,
    handleClaimMilestone,
    activateMilestoneLoading,
    claimMilestoneLoading,
    grantStage,
    setGrantStage,
    grantStageLoading,
    grantId,
  } = useLaunch();
  const { handleShuffleCollectionLevels, priceIndex, setPriceIndex } =
    useLevelItems();
  const { handleLensSignIn, signInLoading } = useSignIn();
  const { openConnectModal } = useConnectModal();
  const router = useRouter();
  const dispatch = useDispatch();
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const levelArray = useSelector(
    (state: RootState) => state.app.levelArrayReducer.collections
  );
  const connected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  return (
    <div className="relative w-full h-full flex items-center justify-center p-5 overflow-y-hidden">
      <div className="relative w-3/5 h-4/5 items-center justify-center gap-4 flex">
        <LaunchSwitch
          dateOpen={dateOpen}
          levelArray={levelArray}
          setPriceIndex={setPriceIndex}
          priceIndex={priceIndex}
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
          grantStage={grantStage}
          imageLoading={imageLoading}
          handleImageUpload={handleImageUpload}
          postLoading={postLoading}
          registerLoading={registerLoading}
          signInLoading={signInLoading}
          grantPosted={grantPosted}
          grantRegistered={grantRegistered}
          handleRegisterGrant={handleRegisterGrant}
          handlePostGrant={handlePostGrant}
          handleShuffleCollectionLevels={handleShuffleCollectionLevels}
          grantStageLoading={grantStageLoading}
          router={router}
          pubId={grantId}
          profileId={profileId}
          openConnectModal={openConnectModal}
          handleLensSignIn={handleLensSignIn}
          connected={connected}
        />
      </div>
      <Deploy
        dispatch={dispatch}
        grantStageLoading={grantStageLoading}
        setGrantStage={setGrantStage}
        grantStage={grantStage}
        postInformation={postInformation}
        setPostInformation={setPostInformation}
      />
    </div>
  );
}
