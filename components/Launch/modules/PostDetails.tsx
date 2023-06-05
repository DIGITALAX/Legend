import { Erc20, Profile } from "@/components/home.types";
import createProfilePicture from "@/lib/lens/helpers/createProfilePicture";
import syncScroll from "@/lib/lens/helpers/syncScroll";
import Image from "next/legacy/image";
import { FormEvent, FunctionComponent, KeyboardEvent } from "react";
import { PostDetailsProps } from "../types/launch.types";
import Draggable from "react-draggable";
import { INFURA_GATEWAY } from "@/lib/constants";
import SmallBox from "@/components/Common/modules/SmallBox";
import TopBarOne from "@/components/Common/modules/TopBarOne";
import TopBarTwo from "@/components/Common/modules/TopBarTwo";

const PostDetails: FunctionComponent<PostDetailsProps> = ({
  title,
  setTitle,
  recipients,
  setRecipients,
  textElement,
  preElement,
  handlePostDescription,
  postDescription,
  mentionProfiles,
  profilesOpen,
  caretCoord,
  handleMentionClick,
  handleKeyDownDelete,
  editionAmount,
  setEditionAmount,
  currency,
  setCurrency,
  valueAmount,
  setValueAmount,
  setReferralFee,
  referralFee,
  enabledCurrencies,
  setInvolved,
  setSustained,
  sustained,
  involved,
  filledInAmount,
  collapseNumber,
  dispatch,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex items-center z-1">
      <Draggable enableUserSelectHack={false}>
        <div
          className={`relative w-72  flex gap-3 bg-mal rounded-md border-2 border-mora left-10 p-6 z-1 cursor-grab active:cursor-grabbing`}
        >
          <div className="relative w-full h-full bg-otra items-center flex flex-col">
            <TopBarOne
              collapseNumber={collapseNumber}
              dispatch={dispatch}
              index={0}
            />
            <div
              className={`p-2 w-full h-full flex-col gap-3 ${
                collapseNumber[0] ? "hidden" : "flex"
              }`}
            >
              <div className="relative w-fit h-fit flex font-mega text-mazul text-xl uppercase">
                What's the name of your grant?
              </div>
              <div className="relative w-full h-full flex flex-col bg-mazul border border-black gap-3 p-2">
                <div className="relative w-fit h-fit flex font-mega text-white uppercase text-center flex flex-col gap-1">
                  <div className="text-sm"> Be creative!</div>
                  <div className="text-2xl"> REMEMBER, </div>
                  <div className="text-sm">
                    you want your grant to stand out.
                  </div>
                </div>
                <div className="relative w-full h-full flex items-center justify-center rounded-md">
                  <div className="absolute w-full h-full flex">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  <textarea
                    className="relative w-full h-full flex cursor-white bg-mold border border-lily text-black font-mega text-sm p-1 rounded-md"
                    style={{ resize: "none" }}
                    onChange={(e: FormEvent) =>
                      setTitle((e.target as HTMLFormElement).value)
                    }
                    value={title}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div
          className={`relative w-96  flex gap-3 bg-darker rounded-md border-2 border-mora p-6 -top-10 -left-24  cursor-grab active:cursor-grabbing`}
        >
          <div className="relative w-full h-full bg-otra items-center flex flex-col">
            <TopBarOne
              collapseNumber={collapseNumber}
              dispatch={dispatch}
              index={1}
            />
            <div
              className={`p-2 flex w-full h-full flex-col gap-3 ${
                collapseNumber[1] ? "hidden" : "flex"
              }`}
            >
              <div className="relative w-fit h-fit flex font-mega text-mazul text-xl uppercase">
                What's being built?
              </div>
              <div className="relative w-full h-full flex flex-col bg-lily border border-black gap-3 p-2">
                <div className="relative w-fit h-fit flex font-mega text-black uppercase flex flex-col gap-1 text-xs">
                  Describe what your grant is for, what the final product will
                  be, and who it benefits the most.
                </div>
                <div className="relative w-full h-full p-px rounded-md">
                  <div className="relative w-full h-80 border border-white p-px rounded-md grid grid-flow-col auto-cols-auto">
                    <textarea
                      id="post"
                      onScroll={(e: any) => syncScroll(textElement, preElement)}
                      onInput={(e: FormEvent) => {
                        handlePostDescription(e);
                        syncScroll(textElement, preElement);
                      }}
                      onKeyDown={(e: KeyboardEvent<Element>) =>
                        handleKeyDownDelete(e)
                      }
                      style={{ resize: "none" }}
                      className="relative w-full h-full bg-mazul font-earl text-white p-2 z-1 rounded-lg overflow-y-scroll"
                      ref={textElement}
                      value={postDescription}
                    ></textarea>
                    <pre
                      id="highlighting"
                      className={`absolute w-full h-full bg-mazul font-earl text-white p-2 rounded-lg overflow-y-auto`}
                      ref={preElement}
                    >
                      <code
                        id="highlighted-content"
                        className={`w-full h-full place-self-center text-left whitespace-pre-wrap overflow-y-auto z-0`}
                      ></code>
                    </pre>
                    {mentionProfiles?.length > 0 && profilesOpen && (
                      <div
                        className={`absolute w-44 max-h-28 h-fit flex flex-col overflow-y-auto items-start justify-start z-2 rounded-lg`}
                        style={{
                          top: caretCoord.y + 30,
                          left: caretCoord.x,
                        }}
                      >
                        {mentionProfiles?.map(
                          (user: Profile, index: number) => {
                            const profileImage: string =
                              createProfilePicture(user);
                            return (
                              <div
                                key={index}
                                className={`relative w-full h-fit px-3 py-2 bg-white flex flex-row gap-3 cursor-pointer items-center justify-center border-y border-black hover:bg-rosa/70 z-2`}
                                onClick={() => handleMentionClick(user)}
                              >
                                <div className="relative flex flex-row w-full h-full text-black font-earl lowercase place-self-center gap-2">
                                  <div
                                    className={`relative rounded-full flex bg-white w-3 h-3 items-center justify-center col-start-1`}
                                    id="crt"
                                  >
                                    {profileImage !== "" && (
                                      <Image
                                        src={profileImage}
                                        objectFit="cover"
                                        alt="pfp"
                                        layout="fill"
                                        className="relative w-fit h-fit rounded-full items-center justify-center flex"
                                        draggable={false}
                                      />
                                    )}
                                  </div>
                                  <div className="relative col-start-2 items-center justify-center w-fit h-fit text-xs flex">
                                    @{user?.handle?.split(".lens")[0]}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div
          className={`absolute w-80 flex gap-3 bg-lez border-2 border-mazul bottom-48 right-20  cursor-grab active:cursor-grabbing ${
            collapseNumber[2] ? "h-6" : "h-fit"
          }`}
        >
          <div className="relative w-full h-full bg-lez items-center flex flex-col">
            <TopBarOne
              collapseNumber={collapseNumber}
              dispatch={dispatch}
              index={2}
            />
            <div
              className={`p-2 w-full h-full flex-row gap-1 ${
                collapseNumber[2] ? "hidden" : "flex"
              }`}
            >
              <div className="relative w-full h-full flex flex-col gap-3 p-2">
                <div className="relative w-full h-full flex items-center justify-center rounded-md">
                  <div className="absolute w-full h-full flex">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  <textarea
                    className="relative w-full h-60 flex cursor-white bg-blez border border-glez text-black font-mega text-sm p-1 rounded-md"
                    style={{ resize: "none" }}
                    onChange={(e: FormEvent) =>
                      setSustained((e.target as HTMLFormElement).value)
                    }
                    value={sustained}
                  ></textarea>
                </div>
                <div className="relative w-fit h-fit flex font-mega text-mazul text-xl uppercase">
                  How will the grant be sustained?
                </div>
              </div>
              <div className="relative w-4 h-full flex-col flex">
                <div className="relative w-4 h-28 justify-center items-center flex">
                  <Image
                    src={`${INFURA_GATEWAY}/QmeAQhTDsfdCfGykQpgfVBJXBK3f3fuM228KjregyLQ3M1`}
                    layout="fill"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div
          className={`absolute bottom-10 left-24 flex w-fit z-1  cursor-grab active:cursor-grabbing`}
        >
          <SmallBox
            title={"How many editions?"}
            onChangeFunction={(e: FormEvent) =>
              setEditionAmount((e.target as HTMLFormElement).value)
            }
            value={editionAmount}
            collapseNumber={collapseNumber}
            dispatch={dispatch}
            index={3}
          />
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div
          className={`absolute -bottom-10 left-40 flex w-fit z-1  cursor-grab active:cursor-grabbing`}
        >
          <SmallBox
            title={"How much?"}
            onChangeFunction={(e: FormEvent) =>
              setValueAmount((e.target as HTMLFormElement).value)
            }
            value={valueAmount}
            collapseNumber={collapseNumber}
            dispatch={dispatch}
            index={4}
          />
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div
          className={`absolute -bottom-10 left-52 flex w-fit z-1 cursor-grab active:cursor-grabbing`}
        >
          <SmallBox
            title={"Referral Fee?"}
            onChangeFunction={(e: FormEvent) =>
              setReferralFee((e.target as HTMLFormElement).value)
            }
            value={referralFee}
            collapseNumber={collapseNumber}
            dispatch={dispatch}
            index={5}
          />
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div
          className={`absolute w-60 flex gap-3 bg-white border-2 border-mazul right-2  cursor-grab active:cursor-grabbing `}
        >
          <div className="relative w-full h-full items-center flex flex-col">
            <TopBarTwo
              collapseNumber={collapseNumber}
              dispatch={dispatch}
              index={6}
            />
            <div
              className={`p-2 flex w-full h-full flex-col gap-3 ${
                collapseNumber[6] ? "hidden" : "flex"
              }`}
            >
              <div className="w-full h-60 border border-black bg-mist items-center justify-center flex">
                <div className="relative w-20 h-20">
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/QmeWeZdKj7rssxWSgFBafXubYc7k9DgnGN4pWzHcV6fvKY`}
                    draggable={false}
                  />
                </div>
              </div>
              <div className="relative w-fit h-fit flex font-mega text-mazul text-xl text-center">
                WHO ARE YOU? Be descriptive.
              </div>
              <div className="relative w-fit h-fit flex font-mega text-mazul text-sm text-center">
                Help collectors understand the people behind the grant,
                including your experience, and intent:
              </div>
              <div className="relative w-full h-full flex items-center justify-center rounded-md">
                <div className="absolute w-full h-full flex opacity-70">
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                    draggable={false}
                  />
                </div>
                <textarea
                  className="relative w-full h-full flex p-2 text-black font-earl text-sm bg-transparent rounded-md"
                  style={{ resize: "none" }}
                  onChange={(e: FormEvent) =>
                    setInvolved((e.target as HTMLFormElement).value)
                  }
                  value={involved}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div
          className={`absolute z-1 w-72 flex flex-col rounded-md bg-offWhite border-2 border-mazul left-10  cursor-grab active:cursor-grabbing`}
        >
          <TopBarTwo
            collapseNumber={collapseNumber}
            dispatch={dispatch}
            index={7}
          />
          <div
            className={`p-2 w-full h-full flex flex-col gap-2 ${
              collapseNumber[7] ? "hidden" : "flex"
            }`}
          >
            <div className="relative w-full h-fit flex font-mega text-lg uppercase text-mazul p-2 items-center justify-center text-center">
              SELECT CURRENCY
            </div>
            <div className="relative w-full h-full flex">
              <div className="relative w-fit h-fit flex flex-row gap-2 flex-wrap items-center justify-center">
                {enabledCurrencies?.map(
                  (currencyValue: Erc20, index: number) => {
                    return (
                      <div
                        className={`border border-black flex items-center justify-center font-mega text-mazul px-3 py-2 cursor-pointer ${
                          (currency === currencyValue.symbol ||
                            currency === currencyValue.address) &&
                          "bg-mist"
                        }`}
                        onClick={() => setCurrency(currencyValue.address)}
                        key={index}
                      >
                        {currencyValue.symbol}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div
          className={`absolute right-10 -bottom-10 w-72 flex flex-col rounded-md bg-offWhite border-2 border-mazul  cursor-grab active:cursor-grabbing`}
        >
          <TopBarTwo
            collapseNumber={collapseNumber}
            dispatch={dispatch}
            index={8}
          />
          <div
            className={`p-2 w-full h-full flex flex-col gap-2 ${
              collapseNumber[8] ? "hidden" : "flex"
            }`}
          >
            <div className="relative w-full h-fit flex font-mega uppercase text-mazul p-2 items-center justify-center text-center">
              SET GRANT RECIPIENTS
            </div>
            <div className="relative w-fit h-fit flex flex-col gap-2">
              {recipients?.map(
                (
                  recipient: {
                    recipient: string;
                    split: number;
                  },
                  index: number
                ) => {
                  return (
                    <div
                      className="relative flex flex-row gap-2 font-mega text-sm"
                      key={index}
                    >
                      <div className="relative flex flex-col gap-1">
                        <div className="w-fit h-fit">ADDRESS</div>
                        <input
                          className="relative w-full h-fit font-earl bg-oscura border border-azul rounded-md p-1"
                          value={recipient.recipient}
                          onChange={(e) => {
                            const updatedRecipients = recipients.map((r, i) =>
                              i === index
                                ? { ...r, recipient: e.target.value.trim() }
                                : r
                            );
                            setRecipients(updatedRecipients);
                          }}
                        />
                      </div>
                      <div className="relative flex flex-col gap-1">
                        <div className="w-fit h-fit"> SPLIT %</div>
                        <input
                          className="relative w-20 h-fit font-earl bg-oscura border border-azul rounded-md p-1"
                          type="number"
                          value={recipient.split.toFixed(0)}
                          onChange={(e) => {
                            const updatedRecipients = recipients.map((r, i) =>
                              i === index
                                ? { ...r, split: Number(parseInt(e.target.value).toFixed(0)) }
                                : r
                            );
                            setRecipients(updatedRecipients);
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div
          className={`absolute bottom-40 right-10 w-72 flex flex-col rounded-md bg-white border-2 border-mazul z-2  cursor-grab active:cursor-grabbing`}
        >
          <TopBarTwo />
          <div className="p-2 w-full h-full flex flex-row gap-2 p-2 items-center justify-center">
            <div className="relative w-full h-4 border border-black rounded-full">
              <div
                className="bg-azul rounded-full h-full"
                style={{
                  width: `${(filledInAmount / 5) * 100}%`,
                }}
              ></div>
            </div>
            <div className="relative w-fit h-fit text-mazul font-mega">%</div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default PostDetails;
