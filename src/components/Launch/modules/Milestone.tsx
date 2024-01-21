import Bar from "@/components/Common/modules/Bar";
import { FunctionComponent, useRef, useState } from "react";
import { MilestoneProps } from "../types/launch.types";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import FocusTrap from "focus-trap-react";
import "react-day-picker/dist/style.css";
import { usePopper } from "react-popper";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";

const Milestone: FunctionComponent<MilestoneProps> = ({
  index,
  dateOpen,
  setDateOpen,
  handleDateSelect,
  selectedDate,
  inputDateValue,
  handleInputDateChange,
  postInformation,
  setPostInformation,
}): JSX.Element => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>();
  const popperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const popper = usePopper(popperRef?.current, popperElement, {
    placement: "bottom-start",
  });

  return (
    <div className="relative w-full h-fit bg-offWhite flex flex-col rounded-b-sm">
      <Bar title={`Milestone ${index + 1}`} />
      <div className="relative p-2 flex w-full flex-col items-center justify-center gap-4 border border-black rounded-b-sm h-full">
        <div className="relative flex flex-col items-start justify-center gap-1 w-full h-fit">
          <div className="relative font-dog text-black text-xxs items-start justify-center w-fit h-fit">
            {`Milestone Goal:`}
          </div>
          <div className="relative w-full h-fit flex gap-2 flex-col items-start justify-center">
            {postInformation?.currencies?.map(
              (currency: string, indexTwo: number) => {
                return (
                  <div
                    className="relative w-full h-fit flex flex-row items-center justify-start gap-2"
                    key={indexTwo}
                  >
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      <div
                        className={`relative w-5 h-6 rounded-full flex items-center`}
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${
                            ACCEPTED_TOKENS_MUMBAI.find(
                              (item) => item[2] == currency
                            )?.[0]
                          }`}
                          className="flex"
                          draggable={false}
                          width={30}
                          height={35}
                        />
                      </div>
                    </div>
                    <input
                      type="number"
                      className="w-full h-8 bg-offWhite border border-black text-xxs text-black font-dog p-1 flex items-center justify-center rounded-sm"
                      onChange={(e) => {
                        let milestones = [...postInformation?.milestones];
                        let currencyAmount = [
                          ...(milestones[index].currencyAmount || []),
                        ];

                        const currencyIndex = currencyAmount?.findIndex(
                          (item) => item.currency == currency
                        );

                        if (currencyIndex !== -1) {
                          currencyAmount[currencyIndex] = {
                            currency,
                            goal: Number(e.target.value),
                          };
                        } else {
                          currencyAmount = [
                            ...currencyAmount,
                            {
                              currency,
                              goal: Number(e.target.value),
                            },
                          ];
                        }

                        milestones[index] = {
                          ...milestones[index],
                          currencyAmount,
                        };

                        setPostInformation({
                          ...postInformation,
                          milestones,
                        });
                      }}
                      value={
                        postInformation?.milestones[index]?.currencyAmount?.[
                          postInformation?.milestones[
                            index
                          ]?.currencyAmount?.findIndex(
                            (item) => item.currency == currency
                          )
                        ]?.goal
                      }
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className="relative w-full h-full border border-black rounded-sm items-center justify-center flex">
          <textarea
            className="bg-quemo break-words p-2 text-amar font-dog text-xxs flex w-full h-80 rounded-sm"
            placeholder="Milestone Description..."
            style={{
              resize: "none",
            }}
            onChange={(e) => {
              const milestones = [...postInformation?.milestones];
              milestones[index].description = e.target.value;

              setPostInformation({
                ...postInformation,
                milestones: milestones,
              });
            }}
            value={postInformation?.milestones[index]?.description}
          ></textarea>
        </div>

        <div className="relative flex flex-col items-start justify-end gap-1 w-full h-fit">
          <div className="relative font-dog text-black text-xxs items-start justify-center w-fit h-fit">
            Submit By:
          </div>
          <div className="relative flex flex-row items-start justify-center gap-1 w-full h-fit">
            <div className="relative h-fit flex items-center flex-row gap-2 w-full">
              <div
                className="relative flex flex-row gap-2 items-center justify-between w-full h-fit"
                ref={popperRef}
              >
                <input
                  type="text"
                  className="w-full h-8 bg-quemo text-xxs text-amar font-dog p-1 flex items-center justify-center"
                  placeholder={format(
                    new Date(new Date().setMonth(new Date().getMonth() + 1)),
                    "yy-MM-dd"
                  )}
                  value={inputDateValue[index]}
                  onChange={(e) => handleInputDateChange(e, index)}
                />
                <div className="relative w-fit h-fit flex items-center justify-center mr-0">
                  <div
                    onClick={() => {
                      const newDateOpen = [...dateOpen];
                      newDateOpen[index] = !newDateOpen[index];
                      setDateOpen(newDateOpen);
                    }}
                    ref={buttonRef}
                    className="relative w-fit h-8 px-1 text-xxs cursor-pointer active:scale-95 border border-black text-black font-dog flex items-center justify-center"
                  >
                    Date
                  </div>
                </div>
              </div>
              {dateOpen[index] && (
                <FocusTrap
                  active
                  focusTrapOptions={{
                    initialFocus: false,
                    allowOutsideClick: true,
                    clickOutsideDeactivates: true,
                    fallbackFocus: buttonRef?.current || undefined,
                  }}
                >
                  <div
                    tabIndex={-1}
                    style={{
                      ...popper?.styles.popper,
                      zIndex: 1000,
                      borderColor: "black",
                      borderRadius: "0.375rem",
                      fontFamily: "Dogica",
                      fontSize: "0.6rem",
                    }}
                    {...popper?.attributes.popper}
                    ref={(element) => setPopperElement(element)}
                  >
                    <DayPicker
                      initialFocus={dateOpen?.[index]!}
                      mode="single"
                      defaultMonth={selectedDate?.[index]!}
                      selected={selectedDate?.[index]}
                      onSelect={(date) => handleDateSelect(date, index)}
                      style={{
                        backgroundColor: "white",
                      }}
                    />
                  </div>
                </FocusTrap>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Milestone;
