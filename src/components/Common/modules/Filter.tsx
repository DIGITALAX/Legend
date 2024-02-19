import Bar from "@/components/Common/modules/Bar";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import handleSearchProfiles from "../../../../lib/lens/helpers/handleSearchProfiles";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import { Profile } from "../../../../graphql/generated";
import { FilterProps } from "../types/common.types";

const Filter: FunctionComponent<FilterProps> = ({
  searchFilters,
  setSearchFilters,
  inputElement,
  lensConnected,
  setProfilesOpen,
  setMentionProfiles,
  setCaretCoord,
  profilesOpen,
  mentionProfiles,
  router,
}): JSX.Element => {
  return (
    <div className="relative sm:static w-full sm:w-fit h-fit flex items-center justify-start flex-col bg-offBlack">
      <Bar title="Sort All Items" />
      <div className="relative w-full h-fit gap-6 flex flex-col bg- px-3 pb-3 pt-7 text-white">
        <div className="relative flex flex-col gap-2 justify-start items-start">
          <div className="relative w-fit h-fit font-dog text-xxs">
            {router?.asPath?.includes("/store")
              ? "Sort by Print"
              : "Sort by Level Prints"}
          </div>
          <div className="relative grid grid-cols-2 gap-1.5 items-center justify-start w-full h-fit">
            {[
              ["shirt", "QmVbePRht5te5J9JzGGrnMocPZkSWnqGPEaNMZTSjFoYDr"],
              ["hoodie", "QmRMWKP63xaJQsspfnLL9Fhou484LEb2VbTWFyfYsJ1aep"],
              ["poster", "QmPpDcEHfhMr3z2Romz45P7ETV4hZEXRbcorF9sDsDfxyC"],
              ["sticker", "QmUADJfzGsFgp9n4XUZD66inxTCijJ9fwMXeUkjuKjHVzs"],
            ].map((item: string[], index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-full h-20 lg:h-28 rounded-sm flex text-xxs cursor-pointer border-viol ${
                    searchFilters?.printType.includes(item[0])
                      ? "border-2"
                      : "border"
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
                    className="rounded-sm flex w-1/2 sm:w-2/3 h-full items-center justify-center"
                    src={`${INFURA_GATEWAY}/ipfs/${item[1]}`}
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2">
          <div className="relative flex flex-col gap-2 justify-start items-start w-full h-fit">
            <div className="relative w-fit h-fit font-dog text-xxs">
              Sort by Grant Title
            </div>
            <div className="relative w-full sm:w-48 lg:w-72 h-8 border border-viol rounded-sm items-center justify-center flex">
              <input
                className="bg-quemo break-words p-2 font-dog text-super flex w-full h-full rounded-sm"
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
          <div className="relative flex flex-col gap-2 justify-start items-start w-full">
            <div className="relative w-fit h-fit font-dog text-xxs">
              {router?.asPath?.includes("/store")
                ? "Sort by Designer"
                : "Sort by Grantee"}
            </div>
            <div className="relative w-full sm:w-48 lg:w-72 h-8 border border-viol rounded-sm items-center justify-center flex">
              <input
                ref={inputElement}
                className="bg-quemo break-words p-2 font-dog text-super flex w-full h-full rounded-sm"
                placeholder="@handle..."
                style={{
                  resize: "none",
                }}
                value={searchFilters?.designer}
                onChange={(e) => {
                  setSearchFilters({
                    ...searchFilters,
                    designer: e.target.value,
                  });
                  handleSearchProfiles(
                    e as any,
                    setProfilesOpen,
                    setMentionProfiles,
                    0,
                    lensConnected,
                    setCaretCoord,
                    inputElement as any
                  );
                }}
              />
            </div>
            {mentionProfiles?.length > 0 && profilesOpen?.[0] && (
              <div
                className={`absolute w-48 lg:w-72 border border-viol max-h-28 h-fit flex flex-col overflow-y-auto items-start justify-start z-40 top-14 left-0 rounded-sm`}
              >
                {mentionProfiles?.map((user: Profile, indexTwo: number) => {
                  const profileImage = createProfilePicture(
                    user?.metadata?.picture
                  );
                  return (
                    <div
                      key={indexTwo}
                      className={`relative w-full h-10 px-3 py-2 bg-quemo flex flex-row gap-3 hover:opacity-70 cursor-pointer items-center justify-center`}
                      onClick={() => {
                        setProfilesOpen([false]);
                        setSearchFilters({
                          ...searchFilters,
                          designer:
                            user?.handle?.suggestedFormatted?.localName!,
                          designerAddress: user?.ownedBy?.address,
                        });
                      }}
                    >
                      <div className="relative flex flex-row w-full h-full text-white font-dog items-center justify-center gap-2 text-super">
                        <div
                          className={`relative rounded-full flex bg-mar/75 w-4 h-4 items-center border border-white justify-center`}
                        >
                          {profileImage && (
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
                        <div className="relative items-center justify-center w-fit h-fit text-xxs flex">
                          {user?.handle?.suggestedFormatted?.localName}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="relative flex flex-col gap-2 justify-start items-start pb-4">
            <div className="relative w-fit h-fit font-dog text-xxs">
              Order by Block
            </div>
            <div className="relative flex flex-row gap-1.5 items-center justify-start text-super font-dog w-fit h-fit">
              {["latest", "earliest"].map((item: string, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative w-24 h-8 p-1.5 cursor-pointer border border-black rounded-sm items-center justify-center flex flex-row bg-quemo border-lima
                  ${
                    searchFilters?.timestamp.includes(item)
                      ? "border-2"
                      : "border"
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
        </div>
      </div>
    </div>
  );
};

export default Filter;
