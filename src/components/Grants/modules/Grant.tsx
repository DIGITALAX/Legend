import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Bar from "@/components/Common/modules/Bar";
import { GrantProps } from "../types/grant.types";
import { LevelInfo } from "@/components/Launch/types/launch.types";
import CollectItem from "@/components/Common/modules/CollectItem";
import { ImageMetadataV3, Profile } from "../../../../graphql/generated";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import Interactions from "./Interactions";

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
  handleChangeCurrency,
  handleChangeImage,
  handleChangeItem,
  indexes,
  index,
  cartItems,
}) => {
  return (
    <div className="relative h-fit w-[40rem] border border-black flex flex-col items-center justify-center bg-black">
      <Bar title={(grant?.publication?.metadata as ImageMetadataV3)?.title!} />
      <div className="relative w-full h-full flex flex-col gap-8" id="grant">
        <div className="relative w-full h-fit flex break-words font-vcr text-black p-2 justify-start items-center rounded-sm border border-black bg-offWhite p-2 flex-col gap-4">
          <div className="relative w-full h-40 flex items-center justify-start gap-6">
            <div className="relative w-full overflow-y-scroll h-full ustify-start items-center">
              {(grant?.publication?.metadata as ImageMetadataV3)?.content}
            </div>
            <Interactions
              like={like}
              router={router}
              index={index}
              interactionsLoading={interactionsLoading}
              post={grant?.publication!}
              bookmark={bookmark}
              mirror={mirror}
              dispatch={dispatch}
              mirrorChoiceOpen={mirrorChoiceOpen?.[index]}
              setMirrorChoiceOpen={setMirrorChoiceOpen}
            />
          </div>
          <div className="relative w-full h-fit flex justify-start items-start flex-col ml-0 gap-2">
            <div className="relative text-black font-gam text-4xl justify-start items-start flex">
              Grant Team
            </div>
            <div className="relative w-full items-center justify-between flex flex-row gap-2">
              <div className="relative mr-0 w-fit h-fit items-center justify-end flex flex-row gap-2">
                {grant?.grantees?.map((profile: Profile, index: number) => {
                  const pfp = createProfilePicture(profile?.metadata?.picture);
                  return (
                    <div
                      key={index}
                      className="relative w-10 h-10 rounded-full border border-black cursor-pointer flex cursor-pointer active:scale-95"
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
        <div
          className="relative w-full h-80 overflow-y-scroll bg-offWhite border-y border-black flex flex-col gap-4 p-4"
          id="milestone"
        >
          {Array.from({ length: 3 }).map((_, index: number) => {
            return (
              <div
                key={index}
                className="relative bg-cafe border border-marron rounded-sm flex flex-col justify-start items-start p-1.5 font-dog text-amar h-fit gap-4"
              >
                <div className="relative w-fit h-fit flex items-center justify-start text-sm">
                  {`Milestone ${index + 1}`}
                </div>
                <div className="relative w-full h-72 flex items-center justify-between flex-row gap-2">
                  <div className="relative h-full overflow-y-scroll w-full flex items-start justify-start p-1.5"></div>
                  <div className="relative w-60 h-full border border-marron flex items-center justify-center rounded-sm bg-virg">
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        grant?.publication?.metadata.marketplace?.image?.raw.uri?.split(
                          "ipfs://"
                        )?.[1]
                      }`}
                      layout="fill"
                      className="rounded-sm w-full h-full"
                      objectFit="cover"
                      draggable={false}
                    />
                  </div>
                </div>
                <div className="relative flex flex-col items-start justify-start gap-8 border border-white rounded-sm w-full h-fit p-2">
                  <div className="relative w-full h-fit flex items-center justify-between flex-row text-xxs text-white font-dog">
                    <div className="relative w-fit h-fit flex flex-col gap-1 items-start justify-start">
                      <div>Amount:</div>
                      <div>$5000</div>
                    </div>
                    <div className="relative w-fit h-fit flex flex-col gap-1 items-start justify-start">
                      <div>Submit By:</div>
                      <div>{new Date().toDateString()}</div>
                    </div>
                  </div>
                  <div className="relative w-full h-fit items-center justify-start text-white text-xxs font-dog flex flex-col gap-4">
                    <div className="relative w-full h-6 rounded-lg border border-white bg-amar/60 text-black text-center flex items-center justify-center">
                      Not Completed
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="relative flex flex-col items-center justify-center w-full h-fit gap-2 p-5">
          <div className="relative w-fit px-2 py-1 h-12 text-center flex items-center justify-center bg-lima border border-black font-gam uppercase text-6xl text-mar">
            collect grant
          </div>
          <div
            className="relative w-full h-fit bg-offWhite p-2 rounded-sm border border-black overflow-x-scroll items-start justify-start flex flex-col"
            id="milestone"
          >
            <div className="relative w-fit h-fit flex flex-row gap-4 pb-2 items-start justify-start">
              {grant?.levelInfo?.map((level: LevelInfo, index: number) => {
                return (
                  <CollectItem
                    handleChangeCurrency={handleChangeCurrency}
                    handleChangeImage={handleChangeImage}
                    handleChangeItem={handleChangeItem}
                    index={indexes}
                    key={index}
                    dispatch={dispatch}
                    levelInfo={level}
                    id={grant?.publication?.id}
                    router={router}
                    cart
                    simpleCollectLoading={interactionsLoading?.simpleCollect}
                    cartItems={cartItems}
                    handleCheckout={handleCheckout}
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
