import useLaunch from "@/components/Launch/hooks/useLaunch";
import Deploy from "@/components/Launch/modules/Deploy";
import LaunchSwitch from "@/components/Launch/modules/LaunchSwitch";
import { NextRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useLevelItems from "@/components/Launch/hooks/useLevelItems";
import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import { useAccount } from "wagmi";

export default function Launch({ router }: { router: NextRouter }) {
  const { openConnectModal } = useConnectModal();
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
  const isGrantee = useSelector(
    (state: RootState) => state.app.isGranteeReducer.value
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
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
  } = useLevelItems(dispatch, postInformation, allCollections);
  const { handleLensSignIn, signInLoading } = useSignIn(
    dispatch,
    profile,
    oracleData,
    isGrantee,
    publicClient
  );
  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-5 overflow-y-hidden">
      <div
        className="relative w-full h-4/5 items-start justify-center gap-4 flex overflow-y-scroll"
        id="milestone"
      >
        <LaunchSwitch
          dateOpen={dateOpen}
          dispatch={dispatch}
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
        isGrantee={isGrantee}
      />
    </div>
  );
}
