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
    grantStage,
    setGrantStage,
    grantId,
  } = useLaunch();
  const {
    handleShuffleCollectionLevels,
    indexes,
    handleChangeCurrency,
    handleChangeImage,
    handleChangeItem,
    allCollectionsLoading,
  } = useLevelItems();
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
      <div
        className="relative w-3/5 h-4/5 items-start justify-center gap-4 flex overflow-y-scroll"
        id="milestone"
      >
        <LaunchSwitch
          dateOpen={dateOpen}
          levelArray={levelArray}
          setDateOpen={setDateOpen}
          handleDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          inputDateValue={inputDateValue}
          handleInputDateChange={handleInputDateChange}
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
          allCollectionsLoading={allCollectionsLoading}
          router={router}
          pubId={grantId}
          profileId={profileId}
          openConnectModal={openConnectModal}
          handleLensSignIn={handleLensSignIn}
          connected={connected}
          indexes={indexes}
          handleChangeCurrency={handleChangeCurrency}
          handleChangeImage={handleChangeImage}
          handleChangeItem={handleChangeItem}
        />
      </div>
      <Deploy
        dispatch={dispatch}
        setGrantStage={setGrantStage}
        grantStage={grantStage}
        postInformation={postInformation}
        setPostInformation={setPostInformation}
      />
    </div>
  );
}