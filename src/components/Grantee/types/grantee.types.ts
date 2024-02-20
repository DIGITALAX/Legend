import { Grant } from "@/components/Grants/types/grant.types";
import { Profile } from "../../../../graphql/generated";
import { SetStateAction } from "react";
import { AccessControlConditions } from "@lit-protocol/types";
import { OracleData, PrintItem } from "@/components/Launch/types/launch.types";
import { NextRouter } from "next/router";

export type AccountProps = {
  profile: Profile | undefined;
  granteeLoading: boolean;
  followProfile: () => Promise<void>;
  unfollowProfile: () => Promise<void>;
  followLoading: boolean;
  owner: boolean;
  setOrders: (e: SetStateAction<boolean>) => void;
  setEdit: (e: Grant | undefined) => void;
  orders: boolean;
  edit: Grant | undefined;
};

export type EditProps = {
  grant: Grant;
  handleClaimMilestone: (milestone: number) => Promise<void>;
  milestoneClaimLoading: boolean;
  router: NextRouter;
  showFundedHover: boolean[][];
  setShowFundedHover: (e: SetStateAction<boolean[][]>) => void;
};

export type OrdersProps = {
  allOrders: Order[];
  ordersLoading: boolean;
  orderOpen: boolean[];
  setOrderOpen: (e: SetStateAction<boolean[]>) => void;
  orderDecrypting: boolean[];
  decryptOrder: (order: Order) => Promise<void>;
};

export interface Order {
  orderId: string;
  amount: string;
  level: string;
  currency: string;
  funder: string;
  blockTimestamp: string;
  transactionHash: string;
  encryptedFulfillment?: Details | EncryptedDetails | string;
  decrypted: boolean;
  grant: Grant;
  orderCollections: PrintItem[];
}

export interface EncryptedDetails {
  ciphertext: string;
  dataToEncryptHash: string;
  accessControlConditions: AccessControlConditions | undefined;
}

export interface Details {
  fulfillment: {
    name: string;
    contact: string;
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
  };
  colors: string[];
  sizes: string[];
}
