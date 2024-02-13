import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import Bar from "@/components/Common/modules/Bar";
import { GrantProps, Milestone as MilestoneType } from "../types/grant.types";
import moment from "moment";
import { LevelInfo } from "@/components/Launch/types/launch.types";
import CollectItem from "@/components/Common/modules/CollectItem";
import { ImageMetadataV3, Profile } from "../../../../graphql/generated";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import Interactions from "./Interactions";
import LevelOne from "@/components/Launch/modules/LevelOne";
import descriptionRegex from "../../../../lib/graph/helpers/descriptionRegex";
import Milestone from "./Milestone";

const Grant: FunctionComponent<GrantProps> = ({
  grant,
  mirror,
  like,
  bookmark,
  handleCheckout,
  router,
  interactionsLoading,
  dispatch,
  setMirrorChoiceOpen,
  mirrorChoiceOpen,
  mainIndex,
  cartItems,
  setDetails,
  details,
  simpleCollectLoading,
  oracleData,
  approvePurchase,
  spendApproved,
  changeCurrency,
  setChangeCurrency,
}) => {
  return (
    <div className="relative h-fit w-full sm:w-3/4 xl:w-1/2 border border-black flex flex-col items-center justify-center bg-black">
      <Bar
        title={
          (grant?.publication?.metadata as ImageMetadataV3)?.title! +
          " " +
          `(${moment(grant?.publication?.createdAt).fromNow()})`
        }
      />
      <div className="relative w-full h-full flex flex-col gap-8 px-4 py-3 bg-grant bg-repeat bg-contain">
        <div className="relative rounded-sm w-full h-fit p-1 items-center justify-between flex bg-mar/75 border border-lima">
          <Interactions
            like={like}
            router={router}
            index={mainIndex}
            interactionsLoading={interactionsLoading}
            post={grant?.publication!}
            bookmark={bookmark}
            mirror={mirror}
            dispatch={dispatch}
            mirrorChoiceOpen={mirrorChoiceOpen?.[mainIndex]}
            setMirrorChoiceOpen={setMirrorChoiceOpen}
          />
        </div>
        {<div className="relative w-full h-8 bg-lima/75 border border-lima flex rounded-lg"></div>}
        <div className="relative w-full h-60 flex flex-row gap-3 items-center justify-center text text-white">
          <div className="relative w-full h-full flex items-center justify-center w-full h-fit bg-offBlack rounded-sm border border-lima px-3 py-1.5">
            <div
              className="relative w-full h-full flex items-start justify-start break-words text-xxs whitespace-preline overflow-y-scroll font-dog"
              dangerouslySetInnerHTML={{
                __html: descriptionRegex(
                  (grant?.publication?.metadata as ImageMetadataV3)?.content,
                  false
                ),
              }}
            ></div>
          </div>
          <div className="relative w-48 h-full flex items-start justify-center rounded-sm bg-offBlack border border-lima px-1.5">
            <div className="relative w-full h-fit flex justify-start items-start flex-col ml-0 gap-2">
              <div className="relative font-gam text-xl justify-start items-start flex">
                Grant Team
              </div>
              <div className="relative mr-0 w-fit h-fit items-center justify-end flex flex-wrap gap-2">
                {grant?.grantees?.map((profile: Profile, index: number) => {
                  const pfp = createProfilePicture(profile?.metadata?.picture);
                  return (
                    <div
                      key={index}
                      className="relative w-8 h-8 rounded-full border border-lima bg-mar/70 cursor-pointer flex cursor-pointer active:scale-95"
                      title={profile?.handle?.suggestedFormatted?.localName}
                      onClick={() =>
                        router.push(
                          `/grantee/${
                            profile?.handle?.suggestedFormatted?.localName?.split(
                              "@"
                            )?.[1]
                          }`
                        )
                      }
                    >
                      {pfp && (
                        <div className="relative w-full h-full rounded-full flex items-center justify-center">
                          <Image
                            src={pfp}
                            draggable={false}
                            objectFit="cover"
                            layout="fill"
                            className="rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center w-full h-fit gap-2">
          <div className="relative px-2 py-1 text-center flex items-center justify-center bg-mar/70 border border-lima font-gam uppercase rounded-sm text-4xl text-lima w-full h-fit">
            Milestones
          </div>
          <div
            className="relative w-full h-110 overflow-y-scroll bg-offBlack border border-lima rounded-sm flex flex-col gap-16 p-4"
            id="milestone"
          >
            {grant.milestones.map((milestone: MilestoneType, index: number) => {
              return (
                <Milestone
                  acceptedTokens={grant?.acceptedCurrencies}
                  key={index}
                  mainIndex={mainIndex}
                  metadata={grant?.grantMetadata?.milestones?.[index]}
                  milestone={milestone}
                  index={index}
                  changeCurrency={changeCurrency}
                  setChangeCurrency={setChangeCurrency}
                />
              );
            })}
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center w-full h-fit gap-2 pb-5">
          <div className="relative px-2 py-1 text-center flex items-center justify-center bg-mar/70 border border-lima font-gam uppercase rounded-sm text-4xl text-lima w-full h-fit">
            collect grant
          </div>
          <div
            className="relative w-full h-fit  p-2 rounded-sm overflow-x-scroll items-start justify-start flex flex-col"
            id="milestone"
          >
            <div className="relative w-fit h-fit flex flex-row gap-4 pb-2 items-start justify-start">
              <LevelOne
                details={details?.[0]}
                setDetails={setDetails}
                mainIndex={mainIndex}
                oracleData={oracleData}
                cart
                grant={grant}
                handleCheckout={handleCheckout}
                simpleCheckoutLoading={simpleCollectLoading}
                spendApproved={spendApproved}
                approvePurchase={approvePurchase}
                acceptedTokens={grant?.acceptedCurrencies}
              />
              {grant?.levelInfo?.map((level: LevelInfo, index: number) => {
                return (
                  <CollectItem
                    key={index}
                    dispatch={dispatch}
                    levelInfo={level}
                    grant={grant}
                    router={router}
                    cart
                    mainIndex={mainIndex}
                    setDetails={setDetails}
                    details={details?.[level.level]}
                    oracleData={oracleData}
                    cartItems={cartItems}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grant;
