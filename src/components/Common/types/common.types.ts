export type BarProps = {
  title: string;
};

export type PurchaseTokensProps = {
  currency: string;
  handleChangeCurrency: (
    levelIndex: number,
    priceIndex: number,
    checkoutCurrency: string,
    checkoutPrice: number
  ) => void;
  itemIndex: number;
  levelIndex: number;
  priceIndex: number;
};
