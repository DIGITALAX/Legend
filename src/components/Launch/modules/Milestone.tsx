import Bar from "@/components/Common/modules/Bar";
import { FunctionComponent, useRef, useState } from "react";
import { MilestoneProps } from "../types/launch.types";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import FocusTrap from "focus-trap-react";
import "react-day-picker/dist/style.css";
import { usePopper } from "react-popper";
import { AiOutlineLoading } from "react-icons/ai";

const Milestone: FunctionComponent<MilestoneProps> = ({
  index,
  dateOpen,
  setDateOpen,
  handleDateSelect,
  selectedDate,
  inputDateValue,
  handleInputDateChange,
  handleActivateMilestone,
  handleClaimMilestone,
  activateMilestoneLoading,
  claimMilestoneLoading,
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
    <div className="relative w-fit h-full bg-offWhite flex flex-col rounded-b-sm">
      <Bar title={`Milestone ${index + 1}`} />
      <div className="relative p-2 flex w-fit flex-col items-center justify-center gap-4 border border-black rounded-b-sm h-full">
        <div className="relative w-full h-full border border-black rounded-sm items-center justify-center flex">
          <textarea
            className="bg-quemo break-words p-2 text-amar font-dog text-xxs flex w-full h-full rounded-sm"
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
        <div className="relative flex flex-row w-fit h-fit items-end justify-between gap-2">
          <div className="relative flex flex-col items-start justify-center gap-1 w-fit h-fit">
            <div className="relative font-dog text-black text-xxs items-start justify-center w-fit h-fit">
              {`Amt Requested ($):`}
            </div>
            <input
              type="number"
              className="w-16 h-8 bg-quemo text-xxs text-amar font-dog p-1 flex items-center justify-center"
              onChange={(e) => {
                const milestones = [...postInformation?.milestones];
                milestones[index].amount = Number(e.target.value);

                setPostInformation({
                  ...postInformation,
                  milestones: milestones,
                });
              }}
              value={postInformation?.milestones[index]?.amount}
            />
          </div>
          <div className="relative flex flex-col items-start justify-end gap-1 w-fit h-fit">
            <div className="relative font-dog text-black text-xxs items-start justify-center w-fit h-fit">
              Submit By:
            </div>
            <div className="relative flex flex-row items-start justify-center gap-1">
              <div className="relative w-fit h-fit flex items-center justify-center gap-2">
                <div
                  className="relative flex flex-row gap-2 items-center justify-center w-fit h-fit"
                  ref={popperRef}
                >
                  <input
                    type="text"
                    className="w-24 h-8 bg-quemo text-xxs text-amar font-dog p-1 flex items-center justify-center"
                    placeholder={format(
                      new Date(new Date().setMonth(new Date().getMonth() + 1)),
                      "yy-MM-dd"
                    )}
                    value={inputDateValue[index]}
                    onChange={(e) => handleInputDateChange(e, index)}
                  />
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
        {/* <div className="relative w-fit h-fit flex flex-col gap-2">
          <div className="relative w-fit h-fit text-black font-dog text-xs">
            Activate Milestone Claim Period
          </div>
          <div className="relative w-full h-6 rounded-full bg-zana border border-black opacity-60"></div>
          <div className="relative justify-between w-full h-fit flex flex-row items-center">
            <div className="relative w-fit h-8 px-1 text-xxs cursor-pointer active:scale-95 border border-black text-black font-dog flex items-center justify-center bg-vela">
              <div
                className={`relative w-fit h-fit flex items-center justify-center ${
                  activateMilestoneLoading[index] && "animate-spin"
                }`}
              >
                {activateMilestoneLoading[index] ? (
                  <AiOutlineLoading size={15} color={"black"} />
                ) : (
                  "Activate"
                )}
              </div>
            </div>
            <div className="relative w-fit h-8 px-1 text-xxs cursor-pointer active:scale-95 border border-black text-black font-dog flex items-center justify-center opacity-70">
              <div
                className={`relative w-fit h-fit flex items-center justify-center ${
                  claimMilestoneLoading[index] && "animate-spin"
                }`}
              >
                {claimMilestoneLoading[index] ? (
                  <AiOutlineLoading size={15} color={"black"} />
                ) : (
                  "Claim"
                )}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Milestone;
