import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { FilterProps } from "../types/store.types";

const Filter: FunctionComponent<FilterProps> = ({
  searchFilters,
  setSearchFilters,
}): JSX.Element => {
  return (
    <div className="relative w-96 h-full flex items-center justify-center flex-col">
      <Bar title="Sort All Items" />
      <div className="relative w-full h-fit gap-6 flex flex-col bg-offWhite px-3 pb-3 pt-7">
        <div className="relative flex flex-col gap-2 justify-start items-start">
          <div className="relative w-fit h-fit font-dog text-black text-xxs">
            Sort by Print
          </div>
          <div className="relative flex flex-row gap-1.5 items-center justify-start">
            {[
              ["shirt", "QmVbePRht5te5J9JzGGrnMocPZkSWnqGPEaNMZTSjFoYDr"],
              ["hoodie", "QmRMWKP63xaJQsspfnLL9Fhou484LEb2VbTWFyfYsJ1aep"],
              ["poster", "QmPpDcEHfhMr3z2Romz45P7ETV4hZEXRbcorF9sDsDfxyC"],
              ["sticker", "QmUADJfzGsFgp9n4XUZD66inxTCijJ9fwMXeUkjuKjHVzs"],
            ].map((item: string[], index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-20 h-20 rounded-sm flex text-xxs text-white cursor-pointer ${
                    searchFilters?.printType.includes(item[0])
                      ? "border-2 border-viol"
                      : "border border-black"
                  }`}
                  onClick={() => {
                    setSearchFilters({
                      ...searchFilters,
                      printType: searchFilters?.printType.includes(item[0])
                        ? searchFilters?.printType.filter(
                            (filterItem: string) => filterItem !== item[0]
                          )
                        : [...searchFilters?.printType, item[0]],
                    });
                  }}
                >
                  <Image
                    layout="fill"
                    objectFit="cover"
                    className="rounded-sm flex w-2/3 h-full items-center justify-center"
                    src={`${INFURA_GATEWAY}/ipfs/${item[1]}`}
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative flex flex-col gap-2 justify-start items-start w-full">
          <div className="relative w-fit h-fit font-dog text-black text-xxs">
            Sort by Grantee Profile
          </div>
          <div className="relative flex flex-row gap-1.5 items-center justify-start w-full">
            <div className="relative w-full h-10 border border-black rounded-sm items-center justify-center flex">
              <input
                className="bg-quemo break-words p-2 text-amar font-dog text-xxs flex w-full h-full rounded-sm"
                placeholder="@handle.lens..."
                style={{
                  resize: "none",
                }}
                value={searchFilters?.profile}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    profile: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="relative flex flex-col gap-2 justify-start items-start w-full">
          <div className="relative w-fit h-fit font-dog text-black text-xxs">
            Sort by Grant Details
          </div>
          <div className="relative flex flex-row gap-1.5 items-center justify-start w-full">
            <div className="relative w-full h-10 border border-black rounded-sm items-center justify-center flex">
              <input
                className="bg-quemo break-words p-2 text-amar font-dog text-xxs flex w-full h-full rounded-sm"
                placeholder="grant..."
                style={{
                  resize: "none",
                }}
                value={searchFilters?.grant}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    grant: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="relative flex flex-col gap-2 justify-start items-start">
          <div className="relative w-fit h-fit font-dog text-black text-xxs">
            Order by Block Timestamp
          </div>
          <div className="relative flex flex-row gap-1.5 items-center justify-start">
            {["latest", "earliest"].map((item: string, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-fit h-fit p-1.5 cursor-pointer border border-black rounded-sm items-center justify-center flex flex-row font-dog text-white text-xxs bg-mar
                  ${
                    searchFilters?.timestamp.includes(item)
                      ? "border-2 border-viol"
                      : "border border-black"
                  }
                  `}
                  onClick={() =>
                    setSearchFilters({
                      ...searchFilters,
                      timestamp: item,
                    })
                  }
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative flex flex-col gap-2 justify-start items-start">
          <div className="relative w-fit h-fit font-dog text-black text-xxs">
            Total Grant Funded Amount
          </div>
          <div className="relative flex flex-row gap-1.5 items-center justify-start text-xxs">
            <input
              className="bg-quemo font-dog flex items-center justify-center text-center border border-black rounded-sm h-8 w-20 text-amar"
              placeholder="5000"
              onChange={(e) =>
                setSearchFilters({
                  ...searchFilters,
                  amount: {
                    ...searchFilters?.amount,
                    min: Number(e.target.value),
                  },
                })
              }
              type="number"
              value={searchFilters?.amount?.min}
            />
            <div className="relative w-fit h-8 text-white font-dog items-center px-1.5 justify-center flex bg-mar border border-white rounded-md">
              {`>>>`}
            </div>
            <input
              className="bg-quemo font-dog flex items-center justify-center text-center border border-black rounded-sm h-8 w-20 text-amar"
              placeholder="15000"
              onChange={(e) =>
                setSearchFilters({
                  ...searchFilters,
                  amount: {
                    ...searchFilters?.amount,
                    max: Number(e.target.value),
                  },
                })
              }
              type="number"
              value={searchFilters?.amount?.max}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
