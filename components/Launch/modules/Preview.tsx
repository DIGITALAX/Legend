import { FunctionComponent } from "react";
import { PreviewProps } from "../types/launch.types";
import TopBarThree from "@/components/Common/modules/TopBarThree";

const Preview: FunctionComponent<PreviewProps> = ({
  title,
  postDescription,
  referralFee,
  recipients,
  editionAmount,
  valueAmount,
  currency,
  involved,
  sustained,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full z-0 flex items-center justify-center">
      <div className="flex-col flex relative w-3/4 h-11/12 bg-white border border-2 border-mazul overflow-y-scroll">
        <TopBarThree text={"GRANT PREVIEW"} />
        <div className="flex w-full h-fit flex-col gap-6 font-mega text-white items-start justify-center p-3">
          <div className=" text-2xl text-center relative w-full h-20 py-1.5 px-2 border border-opacity-30 border-2 border-mazul overflow-x-scroll justify-start border-dashed">
            <div
              className="text-center flex w-full h-full justify-center"
              id="borderPreview"
            >
              {title}
            </div>
          </div>
          <div className="flex flex-col gap-3 relative w-full h-fit">
            <div className="flex flex-col relative w-full h-fit gap-2">
              <div className="relative text-mazul w-fit h-fit">
                What is the Grant About?
              </div>
              <div
                className=" text-sm text-center relative w-full h-20 py-1.5 px-2 border border-dashed border-opacity-30 border-2 border-mazul overflow-x-scroll justify-start"
                id="borderPreview"
              >
                <div className="text-center flex w-full h-full justify-center">
                  {postDescription}
                </div>
              </div>
            </div>
            <div className="flex flex-col relative w-full h-fit gap-2">
              <div className="relative text-mazul w-fit h-fit">
                How will it be Sustained?
              </div>
              <div
                className=" text-sm text-center relative w-full h-20 py-1.5 px-2 border border-dashed border-opacity-30 border-2 border-mazul overflow-x-scroll justify-start"
                id="borderPreview"
              >
                <div className="text-center flex w-full h-full justify-center">
                  {sustained}
                </div>
              </div>
            </div>
            <div className="flex flex-col relative w-full h-fit gap-2">
              <div className="relative text-mazul w-fit h-fit">
                About the team
              </div>
              <div
                className=" text-sm text-center relative w-full h-20 py-1.5 px-2 border border-dashed border-opacity-30 border-2  border-mazul overflow-x-scroll justify-start"
                id="borderPreview"
              >
                <div className="text-center flex w-full h-full justify-center">
                  {involved}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-3 relative w-full h-fit">
            <div className="flex flex-col relative w-fit h-fit gap-2">
              <div className="relative text-mazul w-fit h-fit">
                Grant Amount
              </div>
              <div
                className=" text-sm text-center relative w-full h-10 py-1.5 px-2 border border-dashed border-opacity-30 border-2 border-mazul justify-start"
                id="borderPreview"
              >
                <div className="text-center flex w-full h-full justify-center">
                  {valueAmount}
                </div>
              </div>
            </div>
            <div className="flex flex-col relative w-fit h-fit gap-2">
              <div className="relative text-mazul w-fit h-fit">Editions</div>
              <div
                className=" text-sm text-center relative w-full h-10 py-1.5 px-2 border border-dashed border-opacity-30 border-2 border-mazul justify-start"
                id="borderPreview"
              >
                <div className="text-center flex w-full h-full justify-center">
                  {editionAmount}
                </div>
              </div>
            </div>
            <div className="flex flex-col relative w-fit h-fit gap-2">
              <div className="relative text-mazul w-fit h-fit">Referral</div>
              <div
                className=" text-sm text-center relative w-full h-10 py-1.5 px-2 border border-dashed border-opacity-30 border-2 border-mazul justify-start"
                id="borderPreview"
              >
                <div className="text-center flex w-full h-full justify-center">
                  {referralFee}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
