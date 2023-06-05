import TopBarThree from "@/components/Common/modules/TopBarThree";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { LiveProps } from "../types/launch.types";
import { AiOutlineLoading } from "react-icons/ai";
import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import createProfilePicture from "@/lib/lens/helpers/createProfilePicture";
import TopBarTwo from "@/components/Common/modules/TopBarTwo";

const Live: FunctionComponent<LiveProps> = ({
  profile,
  postValues,
  storefrontValues,
  NFTURIArray,
  contractValues,
  postGrant,
  postLoading,
  nextStore,
  setNextStore,
  nextURI,
  setNextURI,
  enabledCurrencies,
}): JSX.Element => {
  const pfp = createProfilePicture(profile);
  return (
    <div className="relative flex flex-col w-full gap-4 h-full px-4">
      <Draggable enableUserSelectHack={false}>
        <div className="relative w-full h-full z-0 flex items-center justify-center cursor-grab active:cursor-grabbing -left-60">
          <div className="flex-col flex relative w-3/5 h-11/12 bg-white border border-2 border-mazul overflow-y-scroll">
            <TopBarThree text={"GRANT PREVIEW"} />
            <div className="flex w-full h-fit flex-col gap-6 font-mega text-white items-start justify-center p-3">
              <div className="relative flex flex-row w-full h-fit gap-3">
                <div className="relative w-fit h-full flex items-center justify-start">
                  <div className="relative border-2 border-black rounded-md w-40 h-40 bg-darker">
                    <Image
                      layout="fill"
                      src={pfp}
                      objectFit="cover"
                      className="rounded-md"
                      draggable={false}
                    />
                  </div>
                </div>
                <div className="relative flex flex-col w-full h-fit gap-2 justify-center">
                  <div className=" text-2xl text-center relative w-full h-fit py-1.5 px-2 overflow-x-scroll justify-start ">
                    <div
                      className="text-center flex w-full h-full justify-center"
                      id="borderPreview"
                    >
                      {postValues.title}
                    </div>
                  </div>
                  <div
                    className=" text-sm text-center relative w-full h-24 py-1.5 px-2 border-dashed border-opacity-30 border-2 border-mazul overflow-x-scroll justify-start"
                    id="borderPreview"
                  >
                    <div className="text-center flex w-full h-full justify-center">
                      {postValues.description}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row relative w-full h-fit gap-6">
                <div className="flex flex-col relative w-full h-fit gap-2">
                  <div className="relative w-fit h-fit text-mazul font-mega flex justify-start items-center">
                    project sustainment
                  </div>
                  <div
                    className=" text-sm text-center relative w-full h-40 py-1.5 px-2 border border-dashed border-opacity-30 border-2 border-mazul overflow-x-scroll justify-start"
                    id="borderPreview"
                  >
                    <div className="text-center flex w-full h-full justify-center">
                      {postValues.sustained}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col relative w-full h-fit gap-2">
                  <div className="relative w-fit h-fit text-mazul font-mega flex justify-start items-center">
                    about the team
                  </div>
                  <div
                    className=" text-sm text-center relative w-full h-40 py-1.5 px-2 border border-dashed border-opacity-30 border-2 border-mazul overflow-x-scroll justify-start"
                    id="borderPreview"
                  >
                    <div className="text-center flex w-full h-full justify-center">
                      {postValues.involved}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col relative w-48 h-fit gap-2 justify-start items-start">
                  <div className="relative text-mazul w-fit h-fit">
                    Recipients
                  </div>
                  <div className="flex flex-col relative w-full h-fit gap-3 justify-start items-start">
                    {postValues.recipients.map(
                      (
                        recipient: {
                          recipient: string;
                          split: number;
                        },
                        index: number
                      ) => {
                        return (
                          <div
                            key={index}
                            className="relative w-full h-full flex flex-row gap-1.5 font-earl text-mazul  border-dashed border-opacity-30 border-2 border-mazul py-1.5 px-1"
                          >
                            <div className="relative w-40 h-fit">
                              {recipient.recipient.slice(0, 15)}...
                            </div>
                            <div className="relative w-fit h-fit">
                              {recipient.split.toFixed(0)}%
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-3 relative w-full h-fit">
                <div className="flex flex-col relative w-fit h-fit gap-2">
                  <div className="relative text-mazul w-fit h-fit">
                    Grant Amount
                  </div>
                  <div
                    className=" text-sm text-center relative w-full h-10 py-1.5 px-2  border-dashed border-opacity-30 border-2 border-mazul justify-start"
                    id="borderPreview"
                  >
                    <div className="text-center flex w-full h-full justify-center">
                      {postValues.price}{" "}
                      {enabledCurrencies
                        .map((value) =>
                          value.address === postValues.currency ||
                          value.symbol === postValues.currency
                            ? value.symbol
                            : null
                        )
                        .find((value) => value !== null)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col relative w-fit h-fit gap-2">
                  <div className="relative text-mazul w-fit h-fit">
                    Editions
                  </div>
                  <div
                    className=" text-sm text-center relative w-full h-10 py-1.5 px-2 border-dashed border-opacity-30 border-2 border-mazul justify-start"
                    id="borderPreview"
                  >
                    <div className="text-center flex w-full h-full justify-center">
                      {postValues.editionAmount}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col relative w-fit h-fit gap-2">
                  <div className="relative text-mazul w-fit h-fit">
                    Referral
                  </div>
                  <div
                    className=" text-sm text-center relative w-full h-10 py-1.5 px-2 border-dashed border-opacity-30 border-2 border-mazul justify-start"
                    id="borderPreview"
                  >
                    <div className="text-center flex w-full h-full justify-center">
                      {postValues.referralFee}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div
          className={`absolute top-3 right-40 w-96 h-fit flex gap-3 bg-white border-2 border-mazul cursor-grab active:cursor-grabbing`}
        >
          <div className="relative w-full h-full items-center flex flex-col">
            <TopBarTwo />
            <div className="p-2 flex w-full h-full flex-col gap-3 items-center">
              <div className="w-full h-80 border border-black bg-mist items-center justify-center flex cursor-pointer">
                <div className="relative w-full h-full flex items-center justify-center p-1">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/${NFTURIArray[nextURI]}`}
                      draggable={false}
                      objectFit="cover"
                    />
                  </div>
                </div>
              </div>
              <div className="relative w-fit h-fit items-center justify-center font-mega text-azul">
                Collect Amount: {nextURI + 1} / {postValues.editionAmount}
              </div>
              <div className="relative flex flex-row w-full h-fit gap-1 items-center justify-center">
                <div
                  className={`relative bg-darker border border-black flex w-14 text-center text-sm justify-center items-center h-fit p-1 font-earl text-white uppercase cursor-pointer active:scale-95`}
                  onClick={() =>
                    setNextURI(
                      nextURI > 0 ? nextURI - 1 : postValues.editionAmount - 1
                    )
                  }
                >
                  {`<--`}
                </div>
                <div
                  className={`relative bg-darker border border-black flex w-14 text-center text-sm justify-center items-center h-fit p-1 font-earl text-white uppercase cursor-pointer active:scale-95`}
                  onClick={() =>
                    setNextURI(
                      nextURI < postValues.editionAmount - 1 ? nextURI + 1 : 0
                    )
                  }
                >
                  {`-->`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div
          className={`absolute top-6 right-36 w-80 h-fit flex gap-3 bg-white border-2 border-mazul cursor-grab active:cursor-grabbing`}
        >
          <div className="relative w-full h-full items-center flex flex-col">
            <TopBarTwo />
            <div className="p-2 flex w-full h-full flex-col gap-3 items-center">
              <div className="w-full h-52 border border-black bg-mist items-center justify-center flex cursor-pointer">
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/QmV4pRmrrve6j3n5p8yTpgTcstxggh2Vz48GRg7ryZreNh`}
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
              <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                  <div className="absolute w-full h-full flex opacity-70">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  {storefrontValues[nextStore]?.uri?.name}
                </div>
              </div>
              <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-full h-14 flex items-center justify-center rounded-md border border-black">
                  <div className="absolute w-full h-full flex opacity-70">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  {storefrontValues[nextStore]?.uri?.description}
                </div>
              </div>
              <div className="relative grid grid-cols-4 gap-2 w-full h-fit font-earl">
                {Array.from([
                  [
                    "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
                    "WMATIC",
                    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
                  ],
                  [
                    "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
                    "WETH",
                    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                  ],
                  [
                    "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
                    "USDT",
                    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
                  ],
                  [
                    "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
                    "MONA",
                    "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
                  ],
                ])
                  .map((item: string[]) => {
                    if (
                      storefrontValues[nextStore]?.acceptedTokens?.includes(
                        item[2].toLowerCase()
                      )
                    ) {
                      const acceptedTokenIndex = storefrontValues[
                        nextStore
                      ]?.acceptedTokens?.findIndex(
                        (token: string) =>
                          token.toLowerCase() === item[2].toLowerCase()
                      );

                      return {
                        ...item,
                        price: String(
                          storefrontValues[nextStore]?.basePrices?.[
                            acceptedTokenIndex
                          ]
                        ),
                      };
                    } else {
                      return {
                        ...item,
                        price: "",
                      };
                    }
                  })
                  .map((value: string[], indexTwo: number) => {
                    return (
                      <div
                        key={indexTwo}
                        className="relative w-full h-fit flex flex-col gap-1 items-center justify-start"
                      >
                        <div className="relative flex flex-row gap-1 w-full h-fit items-center">
                          <div className="relative w-4 h-5 flex rounded-full items-center justify-center">
                            <Image
                              src={`${INFURA_GATEWAY}/${value[0]}`}
                              draggable={false}
                              layout="fill"
                              className="flex"
                            />
                          </div>
                          <div className="relative w-fit h-full flex items-center justify-start text-xs">
                            <div className="relative flex w-full h-full items-center top-px">
                              {value[1]}
                            </div>
                          </div>
                        </div>
                        <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                          <div className="absolute w-full h-full flex opacity-70">
                            <Image
                              layout="fill"
                              src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                              draggable={false}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="relative w-full h-full flex flex-row gap-4 items-end justify-end">
                <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                  <div
                    className={`rounded-md relative border border-black flex w-full text-center text-xs justify-center items-center h-fit py-1.5 font-earl text-white uppercase px-3 bg-darker`}
                  >
                    {storefrontValues[nextStore]?.grantOnly
                      ? " Grant Collectors Only"
                      : "All Collectors"}
                  </div>
                </div>
                <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                  <div className="relative w-fit h-fit flex font-earl text-mazul text-xs">
                    Discount
                  </div>
                  <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                    <div className="absolute w-full h-full flex opacity-70">
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                        draggable={false}
                      />
                    </div>
                    {storefrontValues[nextStore]?.discount}
                  </div>
                </div>
              </div>
              <div className="relative w-full h-full flex flex-row gap-4 items-end justify-end">
                <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                  <div className="relative w-fit h-fit flex font-mega text-mazul text-sm">
                    Amount
                  </div>
                  <div className="relative w-1/4 h-8 flex items-center justify-center rounded-md border border-black">
                    <div className="absolute w-full h-full flex opacity-70">
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                        draggable={false}
                      />
                    </div>
                    {storefrontValues[nextStore]?.amount}
                  </div>
                </div>
                <div className="relative w-fit h-full flex items-end justify-end">
                  <div
                    className={`relative border border-black flex w-16 text-center text-sm justify-center items-center h-8 py-1.5 font-earl text-white uppercase px-3 cursor-pointer active:scale-95 bg-darker`}
                    onClick={() =>
                      setNextStore(
                        nextStore < storefrontValues.length ? nextStore + 1 : 0
                      )
                    }
                  >
                    {"-->"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div
          className={`absolute top-12 right-14 w-80 h-fit flex gap-3 bg-white border-2 border-mazul cursor-grab active:cursor-grabbing`}
        >
          <div className="relative w-full h-full items-center flex flex-col">
            <TopBarTwo />
            <div className="p-2 flex w-full h-full flex-col gap-3 items-center">
              <div className="relative font-mega text-mazul w-full h-fit items-center justify-center flex">
                Factory Deployed Contracts
              </div>
              <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-full h-fit justify-start items-start font-mega text-mazul text-xs">
                  Legend Access Controls
                </div>
                <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                  <div className="absolute w-full h-full flex opacity-70">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  {contractValues[1]}
                </div>
              </div>
              <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-full h-fit justify-start items-start font-mega text-mazul text-xs">
                  Legend Keeper
                </div>
                <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                  <div className="absolute w-full h-full flex opacity-70">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  {contractValues[0]}
                </div>
              </div>
              <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-full h-fit justify-start items-start font-mega text-mazul text-xs">
                  Legend Dynamic NFT
                </div>
                <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                  <div className="absolute w-full h-full flex opacity-70">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  {contractValues[2]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <div className="relative w-full h-fit flex justify-center items-center">
        <div
          className={`relative bg-darker border border-black flex w-40 text-center text-base justify-center items-center h-10 p-1 font-earl text-white uppercase cursor-pointer active:scale-95`}
          onClick={() => postGrant()}
        >
          {postLoading ? (
            <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
              <AiOutlineLoading color="white" size={15} />
            </div>
          ) : (
            "post grant"
          )}
        </div>
      </div>
    </div>
  );
};

export default Live;
