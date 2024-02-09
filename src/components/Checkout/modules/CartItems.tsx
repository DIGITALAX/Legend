import { FunctionComponent } from "react";
import { CartItemsProps } from "../types/checkout.types";
import Bar from "@/components/Common/modules/Bar";

const CartItems: FunctionComponent<CartItemsProps> = ({
  cartItems,
  grantCheckoutLoading,
  handleCheckout,
  encryptedFulfillment,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-center justify-start">
      <Bar title="Cart Items" />
      <div className="relative bg-offWhite w-full h-fit flex flex-col items-center justify-start p-3 gap-3 border border-black rounded-b-sm"></div>
    </div>
  );
};

export default CartItems;
