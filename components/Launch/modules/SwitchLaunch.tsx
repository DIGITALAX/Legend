import { FunctionComponent } from "react";
import PostDetails from "./PostDetails";
import { SwitchLaunchProps } from "../types/launch.types";
import Keeper from "./Keeper";
import Live from "./Live";
import Store from "./Store";
import Contracts from "./Contracts";
import usePost from "../hooks/usePost";
import Preview from "./Preview";
import ImageUploadDynamic from "./ImageUploadDynamic";
import useImageUpload from "../hooks/useImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useContracts from "../hooks/useContracts";
import useKeeper from "../hooks/useKeeper";
import useStorefront from "../hooks/useStorefront";

const SwitchLaunch: FunctionComponent<SwitchLaunchProps> = ({
  profile,
  page,
}): JSX.Element => {
  let action: string;
  const decideStringAction = () => {
    if (!profile?.handle) {
      action = "sign in";
    } else {
      action = String(page);
    }
    return action;
  };

  const {
    textElement,
    preElement,
    handlePostDescription,
    postLoading,
    postDescription,
    mentionProfiles,
    profilesOpen,
    caretCoord,
    handleMentionClick,
    handleKeyDownDelete,
    title,
    setTitle,
    recipients,
    setRecipients,
    editionAmount,
    setEditionAmount,
    currency,
    setCurrency,
    valueAmount,
    setValueAmount,
    setReferralFee,
    referralFee,
    enabledCurrencies,
    sustained,
    setSustained,
    involved,
    setInvolved,
    filledInAmount,
    postGrant,
    nextStore,
    setNextStore,
    nextURI,
    setNextURI,
  } = usePost();

  const {
    uploadZip,
    fileUploadCount,
    fileUploadAmount,
    zipLoading,
    currentImageIndex,
    setCurrentImageIndex,
    handleDropImage
  } = useImageUpload();

  const { createContracts, createContractsLoading } = useContracts();

  const {
    keeperRegisterLoading,
    registerUpkeep,
    sendLink,
    balanceAmount,
    text,
  } = useKeeper();

  const {
    productInformation,
    newPosition,
    setNewPosition,
    handleCollectionPrices,
    handleDescription,
    handleTitle,
    handleEditionAmount,
    imageLoading,
    handleImageUpload,
    mintCollection,
    minted,
    collectionLoading,
    handleDiscount,
    handleGrantOnly,
    handlePrintType,
  } = useStorefront();

  const postValues = useSelector(
    (state: RootState) => state.app.postValuesReducer.value
  );
  const storefrontValues = useSelector(
    (state: RootState) => state.app.storefrontValuesReducer.value
  );
  const contractValues = useSelector(
    (state: RootState) => state.app.contractValuesReducer.value
  );
  const NFTArray = useSelector(
    (state: RootState) => state.app.NFTImageArrayReducer.value
  );
  const addresses = useSelector(
    (state: RootState) => state.app.contractValuesReducer.value
  );
  const collapseNumber = useSelector(
    (state: RootState) => state.app.collapseItemLaunchReducer.value
  );

  const dispatch = useDispatch();

  switch (decideStringAction()) {
    case "5":
      return (
        <Live
          profile={profile}
          postValues={postValues}
          storefrontValues={storefrontValues}
          NFTURIArray={NFTArray}
          contractValues={contractValues}
          postGrant={postGrant}
          postLoading={postLoading}
          nextStore={nextStore}
          setNextStore={setNextStore}
          nextURI={nextURI}
          setNextURI={setNextURI}
          enabledCurrencies={enabledCurrencies}
        />
      );

    case "4":
      return (
        <Store
          productInformation={productInformation}
          newPosition={newPosition}
          setNewPosition={setNewPosition}
          editionAmount={postValues.editionAmount}
          handleCollectionPrices={handleCollectionPrices}
          handleDescription={handleDescription}
          handleTitle={handleTitle}
          handleEditionAmount={handleEditionAmount}
          handleImageUpload={handleImageUpload}
          imageLoading={imageLoading}
          mintCollection={mintCollection}
          minted={minted}
          collectionLoading={collectionLoading}
          handleDiscount={handleDiscount}
          handleGrantOnly={handleGrantOnly}
          handlePrintType={handlePrintType}
        />
      );

    case "3":
      return (
        <Keeper
          keeperRegisterLoading={keeperRegisterLoading}
          registerUpkeep={registerUpkeep}
          sendLink={sendLink}
          balanceAmount={balanceAmount}
          text={text}
        />
      );

    case "2":
      return (
        <Contracts
          createContracts={createContracts}
          createContractsLoading={createContractsLoading}
          addresses={addresses}
        />
      );

    case "1":
      return (
        <ImageUploadDynamic
          zipLoading={zipLoading}
          uploadZip={uploadZip}
          fileUploadCount={fileUploadCount}
          editionAmount={postValues.editionAmount}
          fileUploadAmount={fileUploadAmount}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          NFTURIValues={NFTArray}
          handleDropImage={handleDropImage}
        />
      );

    case "sign in":
      return (
        <div className="font-earl text-white flex flex-col items-center justify-center text-center w-full h-full">
          Connect to Launch a Grant
        </div>
      );

    default:
      return (
        <div className="relative w-full h-full flex flex-row gap-3 items-center justify-center">
          <PostDetails
            textElement={textElement}
            preElement={preElement}
            handlePostDescription={handlePostDescription}
            postDescription={postDescription}
            mentionProfiles={mentionProfiles}
            profilesOpen={profilesOpen}
            caretCoord={caretCoord}
            handleMentionClick={handleMentionClick}
            handleKeyDownDelete={handleKeyDownDelete}
            title={title}
            setTitle={setTitle}
            recipients={recipients}
            setRecipients={setRecipients}
            editionAmount={editionAmount}
            setEditionAmount={setEditionAmount}
            currency={currency}
            setCurrency={setCurrency}
            valueAmount={valueAmount}
            setValueAmount={setValueAmount}
            setReferralFee={setReferralFee}
            referralFee={referralFee}
            enabledCurrencies={enabledCurrencies}
            sustained={sustained}
            involved={involved}
            setSustained={setSustained}
            setInvolved={setInvolved}
            filledInAmount={filledInAmount}
            collapseNumber={collapseNumber}
            dispatch={dispatch}
          />
          <Preview
            title={title}
            postDescription={postDescription}
            referralFee={referralFee}
            recipients={recipients}
            editionAmount={editionAmount}
            valueAmount={valueAmount}
            currency={currency}
            sustained={sustained}
            involved={involved}
          />
        </div>
      );
  }
};

export default SwitchLaunch;
