export type BarProps = {
  title: string;
};

export type PurchaseTokensProps = {
  checkoutCurrency: string[];
  setCheckoutCurrency: (e: string[]) => void;
  index: number;
};
