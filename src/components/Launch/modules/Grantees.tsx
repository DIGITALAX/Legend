import { FunctionComponent } from "react";
import { GranteesProps } from "../types/launch.types";
import Bar from "@/components/Common/modules/Bar";

const Grantees: FunctionComponent<GranteesProps> = ({
  postInformation,
  setPostInformation,
}): JSX.Element => {
  return (
    <div className="relative w-full md:w-3/5 min-w-fit h-full flex items-start justify-start flex-col overflow-x-scroll" id="milestone">
      <Bar title="Grantee Info" />
      <div className="relative w-full h-full flex flex-col sm:flex-row justify-start items-start p-4 gap-4 bg-offWhite border border-black rounded-b-sm">
        <div className="relative w-full h-full flex flex-col items-start justify-between gap-6">
          <div className="relative flex flex-col justify-start items-start w-full h-fit font-dog text-black text-xs gap-2">
            <div className="relative w-fit h-fit flex justify-start items-start">
              Grantees Wallet Addresses
            </div>
            <div className="relative w-full flex flex-col gap-2 items-center justify-center">
              {Array.from({ length: 5 }).map((_, index: number) => {
                return (
                  <input
                    key={index}
                    className="bg-offWhite text-black font-dog flex items-center justify-center text-center border border-black rounded-sm h-8 w-full"
                    placeholder="0x..."
                    onChange={(e) => {
                      const grantees = [...postInformation.grantees];
                      grantees[index] = e.target.value;
                      setPostInformation({
                        ...postInformation,
                        grantees,
                      });
                    }}
                    value={postInformation?.grantees?.[index]}
                  />
                );
              })}
            </div>
          </div>
          <div className="relative flex flex-col justify-start items-start w-full h-fit font-dog text-black text-xs gap-2">
            <div className="relative w-fit h-fit flex justify-start items-start">
              {`Award Amount Per Grantee (%)`}
            </div>
            <div className="relative w-full flex flex-col gap-2 items-center justify-center">
              {Array.from({ length: 5 }).map((_, index: number) => {
                return (
                  <input
                    key={index}
                    type="number"
                    className="bg-offWhite text-black font-dog flex items-center justify-center text-center border border-black rounded-sm h-8 w-full"
                    placeholder={`${(index + 1) * 10}%`}
                    max={100}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= 100) {
                        const splits = [...postInformation.splits];
                        splits[index] = value;
                        setPostInformation({
                          ...postInformation,
                          splits,
                        });
                      }
                    }}
                    value={postInformation?.splits?.[index]}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="relative flex flex-col justify-start items-start w-full h-full font-dog text-black text-xs gap-2">
          <div className="relative w-fit h-fit flex justify-start items-start">
            About the Team
          </div>
          <div className="relative w-full h-full">
            <textarea
              className="bg-offWhite w-full h-full border border-black p-2 rounded-sm"
              placeholder="Who's involved?"
              style={{
                resize: "none",
              }}
              onChange={(e) =>
                setPostInformation({
                  ...postInformation,
                  team: e.target.value,
                })
              }
              value={postInformation?.team || ""}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grantees;
