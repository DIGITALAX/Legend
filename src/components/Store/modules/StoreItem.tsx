import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { StoreItemProps } from "../types/store.types";
import Interactions from "@/components/Grants/modules/Interactions";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import Bar from "@/components/Common/modules/Bar";
import { setMediaExpand } from "../../../../redux/reducers/mediaExpandSlice";
import { Grant } from "@/components/Grants/types/grant.types";
import toHexWithLeadingZero from "../../../../lib/lens/helpers/toHexWithLeadingZero";

const StoreItem: FunctionComponent<StoreItemProps> = ({
  collection,
  index,
  like,
  mirror,
  bookmark,
  dispatch,
  router,
  interactionsLoading,
  setMirrorChoiceOpen,
  mirrorChoiceOpen,
}): JSX.Element => {
  const pfp = createProfilePicture(
    collection?.publication?.by?.metadata?.picture
  );
  return (
    <div className="relative w-full h-fit flex flex-col items-center justify-center gap-2">
      <div className="relative w-full h-fit flex flex-col items-center justify-center">
        <Bar
          title={
            collection?.collectionMetadata?.title?.length > 8
              ? collection?.collectionMetadata?.title?.slice(0, 6) + "..."
              : collection?.collectionMetadata?.title
          }
          link={`https://cypher.digitalax.xyz/item/coinop/${collection?.collectionMetadata?.title?.replaceAll(
            " ",
            "_"
          )}`}
        />
        <div
          className="relative w-full h-80 border border-viol rounded-sm bg-offBlack cursor-pointer p-1"
          onClick={() =>
            dispatch(
              setMediaExpand({
                actionValue: true,
                actionMedia: `${INFURA_GATEWAY}/ipfs/${
                  collection?.collectionMetadata?.images?.[0]?.split(
                    "ipfs://"
                  )?.[1]
                }`,
                actionType: "image/png",
              })
            )
          }
        >
          <div className="relative w-full h-full rounded-sm flex items-center justify-center">
            {collection?.collectionMetadata?.images?.[0] && (
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${
                  collection?.collectionMetadata?.images?.[0]?.split(
                    "ipfs://"
                  )?.[1]
                }`}
                layout="fill"
                objectFit="cover"
                className="rounded-sm"
              />
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-offBlack flex"></div>
          </div>
          <div className="absolute bottom-2 left-2 w-full h-fit flex flex-row justify-start items-center overflow-x-scroll">
            <div className="relative w-fit h-fit flex justify-start items-center flex-row gap-2">
              {collection?.grants?.map((item: Grant, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-10 h-10 flex items-center justify-center rounded-full border border-viol cursor-pointer bg-offBlack active:scale-95"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(
                        `/grant/${toHexWithLeadingZero(
                          Number(item?.profileId)
                        )}-${toHexWithLeadingZero(Number(item?.pubId))}`
                      );
                    }}
                    title={item?.grantMetadata?.title}
                  >
                    <Image
                      draggable={false}
                      className="rounded-full"
                      src={`${INFURA_GATEWAY}/ipfs/${
                        item?.grantMetadata?.cover?.split("ipfs://")?.[1]
                      }`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-row justify-between items-center gap-3 py-2 px-1 bg-gradient-to-r from-offBlack via-transparent to-offBlack  border border-lima rounded-sm">
        <div className="relative w-fit h-fit flex items-center justify-center ml-0">
          <div
            className="relative w-6 h-6 rounded-full border border-viol bg-white cursor-pointer"
            onClick={() =>
              window.open(
                `https://cypher.digitalax.xyz/autograph/${
                  collection?.publication?.by?.handle?.suggestedFormatted?.localName?.split(
                    "@"
                  )?.[1]
                }`
              )
            }
            title={
              collection?.publication?.by?.handle?.suggestedFormatted?.localName
            }
          >
            {pfp && (
              <Image
                src={pfp}
                className="rounded-full"
                draggable={false}
                layout="fill"
                objectFit="cover"
              />
            )}
          </div>
        </div>
        <div className="text-white text-xxs font-dog mr-0">
          ${Number(collection?.prices?.[0]) / 10 ** 18}
        </div>
      </div>
      <Interactions
        like={like}
        mirror={mirror}
        interactionsLoading={interactionsLoading}
        dispatch={dispatch}
        bookmark={bookmark}
        post={collection?.publication!}
        router={router}
        mirrorChoiceOpen={mirrorChoiceOpen}
        setMirrorChoiceOpen={setMirrorChoiceOpen}
        index={index}
        grant={`https://cypher.digitalax.xyz/item/coinop/${collection?.collectionMetadata?.title?.replaceAll(
          " ",
          "_"
        )}`}
      />
    </div>
  );
};

export default StoreItem;
