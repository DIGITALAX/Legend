import { Grant } from "@/components/Grants/types/grant.types";
import { LevelInfo, PrintItem } from "@/components/Launch/types/launch.types";

export type CartItemsProps = {
  cartItems: CartItem[];
  grantCheckoutLoading: boolean[];
  handleCheckout: (item: CartItem) => Promise<void>;
  encryptedFulfillment: string | undefined;
};

export type FulfillmentProps = {
  fulfillment: Fulfillment;
  setFulfillment: (e: Fulfillment) => void;
  encryptedFulfillment: string | undefined;
  handleEncryptFulfillment: () => Promise<void>;
  fulfillmentLoading: boolean;
};

export interface CartItem {
  sizes: string[];
  colors: string[];
  amount: number;
  grant: Grant;
  chosenLevel: LevelInfo;
}

export interface Fulfillment {
  number: string;
  street: string;
  state: string;
  country: string;
  zip: string;
  name: string;
}
