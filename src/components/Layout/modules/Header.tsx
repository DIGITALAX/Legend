import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import useSignIn from "../hooks/useSignIn";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { useRouter } from "next/router";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { ImageSet, NftImage } from "../../../../graphql/generated";

const Header: FunctionComponent = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  const connected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const cartAnim = useSelector(
    (state: RootState) => state.app.cartAnimReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const { signInLoading, handleLensSignIn, checkoutOpen, setCheckoutOpen } =
    useSignIn(dispatch, profile);

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
          ["view grants", "", "#7BF678"],
          ["launch grant", "launch", "#D07BF7"],
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
          className="absolute z-20 w-60 right-3 top-12 h-72 rounded-sm bg-black/80 overflow-y-scroll flex flex-col p-3"
          id="milestone"
        >
          {cartItems?.length > 0 ? (
            <div className="relative flex flex-col gap-4 items-center justify-start w-full h-fit px-4 pt-2">
              {cartItems?.map((item, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative flex flex-col gap-2 w-full h-fit items-center justify-start"
                  >
                    <div className="relative w-full h-40 flex items-center justify-center rounded-sm ">
                      <Image
                        draggable={false}
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/`}
                        className="rounded-sm"
                        objectFit="cover"
                      />
                    </div>
                    <div className="relative text-sm font-vcr text-white text-center items-center justify-center w-fit h-fit flex break-words"></div>
                    <div className="relative flex flex-row items-center justify-between gap-2 w-fit h-fit">
                      <div
                        className="relative font-dog items-center justify-center w-fit h-fit text-center cursor-pointer active:scale-95 text-white text-xs"
                        onClick={() => {
                          const newItems = cartItems.map((value) => {
                            return value.collectionId !== item.collectionId;
                          });

                          dispatch(setCartItems(newItems));
                        }}
                      >
                        x
                      </div>
                      <div className="relative w-fit h-fit items-center justify-center font-vcr text-lg text-white break-words text-center">
                        ${item.amount}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative flex items-center justify-center font-dog text-white text-xxs break-words w-full h-full text-center">
              No Items <br /> In Cart Yet.
            </div>
          )}
          <div
            className={`relative w-full h-10 rounded-md bg-emeral border border-black flex items-center justify-center font-dog text-white text-xs break-words text-center ${
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
      )}
    </div>
  );
};

export default Header;
