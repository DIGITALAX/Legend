export type CartItemsProps = {
  cartItems: CartItem[];
  grantCheckoutLoading: boolean[];
  itemCheckedOut: boolean[];
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
  size: string;
  color: string;
  amount: number;
  collectionId: string;
  level: number;
  totalPrice: number;
  fulfiller: string;
}

export interface Fulfillment {
  number: string;
  street: string;
  state: string;
  country: string;
  zip: string;
  name: string;
}
