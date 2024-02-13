import useCheckout from "@/components/Checkout/hooks/useCheckout";
import CartItems from "@/components/Checkout/modules/CartItems";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Fulfillment from "@/components/Checkout/modules/Fulfillment";
import { useAccount } from "wagmi";

export default function Checkout() {
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const litNodeClient = new LitNodeClient({
    litNetwork: "cayenne",
  });
  const { address } = useAccount();
  // const {
  //   handleCheckout,
  //   grantCheckoutLoading,
  //   fulfillment,
  //   setFulfillment,
  //   setChosenCartItem,
  //   chosenCartItem
  // } = useCheckout(cartItems, litNodeClient, address);
  return (
    <div className="relative w-full h-full flex p-5 items-start justify-center">
      <div className="relative flex flex-row items-start justify-center gap-10 w-4/5 h-full">
        {/* <Fulfillment
          fulfillment={fulfillment}
          setFulfillment={setFulfillment}
       
        />
        <CartItems
          cartItems={cartItems}
          grantCheckoutLoading={grantCheckoutLoading}
          handleCheckout={handleCheckout}
        /> */}
      </div>
    </div>
  );
}
