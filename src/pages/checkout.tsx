import useCheckout from "@/components/Checkout/hooks/useCheckout";
import CartItems from "@/components/Checkout/modules/CartItems";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Fulfillment from "@/components/Checkout/modules/Fulfillment";

export default function Checkout() {
  const {
    handleCheckout,
    grantCheckoutLoading,
    itemCheckedOut,
    fulfillment,
    setFulfillment,
    handleEncryptFulfillment,
    encryptedFulfillment,
    fulfillmentLoading,
  } = useCheckout();
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  return (
    <div className="relative w-full h-full flex p-5 items-start justify-center">
      <div className="relative flex flex-row items-start justify-center gap-10 w-4/5 h-full">
        <Fulfillment
          fulfillment={fulfillment}
          setFulfillment={setFulfillment}
          handleEncryptFulfillment={handleEncryptFulfillment}
          encryptedFulfillment={encryptedFulfillment}
          fulfillmentLoading={fulfillmentLoading}
        />
        <CartItems
          cartItems={cartItems}
          grantCheckoutLoading={grantCheckoutLoading}
          itemCheckedOut={itemCheckedOut}
          handleCheckout={handleCheckout}
          encryptedFulfillment={encryptedFulfillment}
        />
      </div>
    </div>
  );
}