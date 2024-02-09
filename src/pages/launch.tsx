import useLaunch from "@/components/Launch/hooks/useLaunch";
import Deploy from "@/components/Launch/modules/Deploy";
import LaunchSwitch from "@/components/Launch/modules/LaunchSwitch";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useLevelItems from "@/components/Launch/hooks/useLevelItems";
import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import { useAccount } from "wagmi";

export default function Launch() {
  const { openConnectModal } = useConnectModal();
  const router = useRouter();
  const dispatch = useDispatch();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI}`
    ),
  });
  const { address } = useAccount();
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const levelArray = useSelector(
    (state: RootState) => state.app.levelArrayReducer.collections
  );
  const connected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const allCollections = useSelector(
    (state: RootState) => state.app.availableCollectionsReducer.collections
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const levelItems = useSelector(
    (state: RootState) => state.app.levelArrayReducer.collections
  );
  const {
    handleInputDateChange,
    handleDateSelect,
    selectedDate,
    inputDateValue,
    dateOpen,
    setDateOpen,
    handlePostGrant,
    postLoading,
    imageLoading,
    handleImageUpload,
    postInformation,
    setPostInformation,
    grantStage,
    setGrantStage,
    grantId,
  } = useLaunch(publicClient, address, profile, levelArray, dispatch);
  const {
    handleShuffleCollectionLevels,
    details,
    setDetails,
    allCollectionsLoading,
  } = useLevelItems(dispatch, allCollections);
  const { handleLensSignIn, signInLoading } = useSignIn(
    dispatch,
    profile,
    oracleData
  );
  return (
    <div className="relative w-full h-full flex items-center justify-center p-5 overflow-y-hidden">
      <div
        className="relative w-full h-4/5 items-start justify-center gap-4 flex overflow-y-scroll"
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
          signInLoading={signInLoading}
          handlePostGrant={handlePostGrant}
          handleShuffleCollectionLevels={handleShuffleCollectionLevels}
          allCollectionsLoading={allCollectionsLoading}
          router={router}
          pubId={grantId}
          profileId={profile?.id}
          openConnectModal={openConnectModal}
          handleLensSignIn={handleLensSignIn}
          connected={connected}
          details={details}
          oracleData={oracleData}
          setDetails={setDetails}
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
