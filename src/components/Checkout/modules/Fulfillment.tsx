import { FunctionComponent } from "react";
import { FulfillmentProps } from "../types/checkout.types";
import Bar from "@/components/Common/modules/Bar";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

const Fulfillment: FunctionComponent<FulfillmentProps> = ({
  fulfillment,
  setFulfillment,
  fulfillmentLoading,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit flex flex-col items-center justify-start">
      <Bar title="Fulfillment Info" />
      <div className="relative bg-offWhite w-full h-fit flex flex-col items-center justify-start p-3 gap-3 border border-black rounded-b-sm">
        <div className="relative flex flex-row gap-6 items-center justify-start w-full h-fit">
          <div className="relative w-full h-fit flex-col flex items-start justify-center text-center gap-2 font-dog  text-xxs">
            <div className="relative w-fit h-fit items-center justify-center text-black">
              Name / Pseudonym
            </div>
            <input
              className="bg-arco text-left flex items-center justify-center w-full h-9 p-1 text-lig border border-gris rounded-sm"
              type="text"
              value={fulfillment?.name}
              onChange={(e) =>
                setFulfillment({
                  ...fulfillment,
                  name: e.target.value,
                })
              }
              disabled={fulfillmentLoading}
            />
          </div>
        </div>
        <div className="relative flex flex-row gap-6 items-center justify-start w-full h-fit">
          <div className="relative w-full h-fit flex-col flex items-start justify-center text-center gap-2 font-dog  text-xxs">
            <div className="relative w-fit h-fit items-center justify-center text-black">
              Apt/House No.
            </div>
            <input
              className="bg-arco text-left flex items-center justify-center w-14 h-9 p-1 text-lig border border-gris rounded-sm"
              type="number"
              value={fulfillment?.number}
              onChange={(e) =>
                setFulfillment({
                  ...fulfillment,
                  number: e.target.value,
                })
              }
              disabled={fulfillmentLoading}
            />
          </div>
          <div className="relative w-full h-fit flex-col flex items-start justify-center text-center gap-2 font-dog  text-xxs">
            <div className="relative w-fit h-fit items-center justify-center text-black">
              Street Address
            </div>
            <input
              className="bg-arco text-left flex items-center justify-center w-52 h-9 p-1 text-lig border border-gris rounded-sm"
              value={fulfillment?.street}
              onChange={(e) =>
                setFulfillment({
                  ...fulfillment,
                  street: e.target.value,
                })
              }
              disabled={fulfillmentLoading}
            />
          </div>
        </div>
        <div className="relative flex flex-row gap-6 items-center justify-start w-full h-fit">
          <div
            className="relative w-full h-fit flex-col flex items-start justify-center text-center gap-2 font-dog  text-xxs"
            id="countrySelect"
          >
            <div className="relative w-fit h-fit items-center justify-center text-black">
              Country
            </div>
            <CountryDropdown
              value={fulfillment?.country}
              onChange={(value) =>
                setFulfillment({
                  ...fulfillment,
                  country: value,
                })
              }
              disabled={fulfillmentLoading}
              classes="countryClass"
            />
          </div>
          <div className="relative w-full h-fit flex-col flex items-start justify-center text-center gap-2 font-dog  text-xxs">
            <div className="relative w-fit h-fit items-center justify-center text-black">
              State
            </div>
            <RegionDropdown
              country={fulfillment?.country}
              value={fulfillment?.state}
              onChange={(value) =>
                setFulfillment({
                  ...fulfillment,
                  state: value,
                })
              }
              disabled={fulfillmentLoading}
              classes="countryClass"
            />
          </div>
        </div>
        <div className="relative flex flex-row gap-6 items-center justify-start w-full h-fit">
          <div className="relative w-full h-fit flex-col flex items-start justify-center text-center gap-2 font-dog  text-xxs">
            <div className="relative w-fit h-fit items-center justify-center text-black">
              Zip
            </div>
            <input
              className="bg-arco text-left flex items-center justify-center w-52 h-9 p-1 text-lig border border-gris rounded-sm"
              type="number"
              value={fulfillment?.zip}
              onChange={(e) =>
                setFulfillment({
                  ...fulfillment,
                  zip: e.target.value,
                })
              }
              disabled={fulfillmentLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fulfillment;
