import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import useSignIn from "../hooks/useSignIn";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { NextRouter } from "next/router";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { ImageSet, NftImage } from "../../../../graphql/generated";
import { ImCross } from "react-icons/im";

const Header: FunctionComponent<{ router: NextRouter }> = ({
  router,
}): JSX.Element => {
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  const connected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer?.data
  );
  const cartAnim = useSelector(
    (state: RootState) => state.app.cartAnimReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const { signInLoading, handleLensSignIn, checkoutOpen, setCheckoutOpen } =
    useSignIn(dispatch, profile, oracleData);

  return (
    <div className="relative bg-black h-12 p-2 justify-center items-center flex flex-row w-full h-fit">
      <Link
        href={"/"}
        className="absolute ml-auto left-2 items-center justify-center flex font-vcr text-white uppercase text-xl cursor-pointer"
      >
        LEGEND
      </Link>
      <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-2">
        {[
          ["storefront", "store", "#F8F87F"],
          ["feed", "", "#7BF678"],
          ["launch", "launch", "#D07BF7"],
          ["web3 public goods", "web3", "#59ABF7"],
        ].map((item: string[], index: number) => {
          return (
            <Link
              key={index}
              href={`/${item[1]}`}
              className="relative w-fit h-fit px-2 py-1.5 items-center justify-center rounded-sm border font-vcr text-white text-xs active:scale-95 hover:opacity-70"
              style={{
                borderColor: item[2],
              }}
            >
              {item[0]}
            </Link>
          );
        })}
      </div>
      <div className="absolute flex items-center justify-center flex-row gap-3 mr-auto right-2">
        <div className="relative flex flex-row gap-1.5 items-center justify-center w-fit h-fit">
          {Array.from(
            { length: 3 },
            () => "QmTFgipESste4Gw5Eq5LZ6naxRMbqu3yonwEHVkyYNMTTt"
          ).map((item: string, index: number) => {
            return (
              <div
                key={index}
                className="relative flex justify-center items-center w-5 h-4"
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${item}`}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
        <div
          className="relative w-5 h-4 flex items-center justify-center cursor-pointer active:scale-95"
          id={cartAnim ? "cartAnim" : ""}
          onClick={() => setCheckoutOpen(!checkoutOpen)}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmcDmX2FmwjrhVDLpNii6NdZ4KisoPLMjpRUheB6icqZcV`}
            layout="fill"
            objectFit="cover"
            draggable={false}
            className="flex items-center justify-center"
          />
          {cartItems.length > 0 && (
            <div className="-bottom-2 -right-2 absolute flex items-center justify-center w-fit h-fit bg-white border-black border text-black font-dog rounded-full">
              <div className="relative w-3 h-3 p-1 top-px text-super flex items-center justify-center">
                {cartItems.length}
              </div>
            </div>
          )}
        </div>
        {connected && profile && (
          <div className="relative flex justify-center items-center w-6 h-6 rounded-full border border-white">
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/${
                profile?.metadata?.picture?.__typename === "ImageSet"
                  ? (profile.metadata.picture as ImageSet)?.raw.uri.split(
                      "ipfs://"
                    )[1]
                  : (
                      profile?.metadata?.picture as NftImage
                    )?.image.raw.uri?.split("ipfs://")[1]
              }`}
              className="rounded-full"
              draggable={false}
            />
          </div>
        )}
        <div
          className={`relative w-20 h-6 items-center justify-center flex font-vcr cursor-pointer active:scale-95 border border-white rounded-sm text-sm ${
            connected && profile ? "text-black bg-white" : "text-white"
          }`}
          onClick={
            !connected
              ? openConnectModal
              : connected && !profile
              ? () => !signInLoading && handleLensSignIn()
              : () => router.push("/account")
          }
        >
          <div
            className={`relative text-center items-center justify-center flex ${
              signInLoading && "animate-spin"
            }`}
          >
            {signInLoading ? (
              <AiOutlineLoading />
            ) : !connected ? (
              "Connect"
            ) : connected && !profile ? (
              "Lens"
            ) : (
              "Account"
            )}
          </div>
        </div>
      </div>
      {checkoutOpen && (
        <div
          className="absolute z-20 w-60 right-3 top-12 h-72 rounded-md bg-black/80 overflow-y-scroll flex flex-col py-3 px-7"
          id="milestone"
        >
          {cartItems?.length > 0 ? (
            <div className="relative flex flex-col gap-4 items-center justify-start w-full h-fit pt-2">
              {cartItems?.map((item, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative flex flex-col gap-2 w-full h-fit items-center justify-start"
                  >
                    <div className="relative text-sm font-vcr text-white text-center items-center justify-center w-fit h-fit flex break-words">
                      {item?.grant?.grantMetadata?.title?.length > 8
                        ? item?.grant?.grantMetadata?.title?.slice(0, 6) + "..."
                        : item?.grant?.grantMetadata?.title +
                          " " +
                          "( Lvl. " +
                          item.chosenLevel.level +
                          ")"}
                    </div>
                    <div className="relative w-full h-56 flex items-center justify-center rounded-sm border border-mar bg-mar/75">
                      <Image
                        draggable={false}
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/${
                          item.chosenLevel.collectionIds?.[0]?.collectionMetadata?.images?.[0]?.split(
                            "ipfs://"
                          )?.[1]
                        }`}
                        className="rounded-sm"
                        objectFit="cover"
                      />
                      <div
                        className="absolute flex -top-1 -right-1 items-center justify-center w-fit h-fit cursor-pointer active:scale-95 border border-white bg-black rounded-full p-1 hover:opacity-70"
                        onClick={() => {
                          const newItems = cartItems
                            .filter((value) => {
                              if (
                                value.grant.grantId == item.grant.grantId &&
                                value.chosenLevel.level ==
                                  item.chosenLevel.level
                              ) {
                                return undefined;
                              } else {
                                return value;
                              }
                            })
                            .filter(Boolean);

                          dispatch(setCartItems(newItems));
                        }}
                      >
                        <ImCross color="white" size={7} />
                      </div>
                    </div>
                    <div className="relative flex flex-row items-center justify-between gap-2 w-fit h-fit">
                      <div className="relative w-fit h-fit flex items-center justify-center flex-row">
                        <div className="relative w-fit h-fit flex"></div>
                        <div></div>
                      </div>
                      <div className="relative font-dog items-center justify-center w-fit h-fit text-center cursor-pointer active:scale-95 text-white text-xxs">
                        {item.amount} x
                      </div>
                      <div className="relative w-fit h-fit items-center justify-center font-dog text-xxs text-white break-words text-center">
                        $
                        {item.chosenLevel.collectionIds?.reduce(
                          (acc, val, index) =>
                            acc +
                            Number(val.prices?.[item?.sizes?.[index] || 0]) /
                              10 ** 18,
                          0
                        )}
                      </div>
                    </div>
                    {index !== cartItems.length - 1 && (
                      <div className="relative w-full bg-mar/70 h-px flex items-center justify-center"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative flex items-center justify-center font-dog text-white text-xxs break-words w-full h-full text-center">
              No Items <br /> In Cart Yet.
            </div>
          )}
          <div className="relative w-full h-fit flex items-center justify-center pt-8">
            <div
              className={`relative w-full h-10 rounded-md bg-lima border border-mar flex items-center justify-center font-gam text-mar text-2xl break-words text-center ${
                cartItems?.length > 0
                  ? "cursor-pointer active:scale-95"
                  : "opacity-70"
              }`}
              onClick={() => {
                if (cartItems?.length > 0) {
                  setCheckoutOpen(false);
                  router.push("/checkout");
                }
              }}
            >
              checkout
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
