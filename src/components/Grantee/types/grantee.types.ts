import { Grant } from "@/components/Grants/types/grant.types";
import { Profile } from "../../../../graphql/generated";
import { SetStateAction } from "react";
import { AccessControlConditions } from "@lit-protocol/types";
import { PrintItem } from "@/components/Launch/types/launch.types";

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
  handleClaimMilestone: () => Promise<void>;
  milestoneClaimLoading: boolean;
};

export type OrdersProps = {
  allOrders: Order[];
  ordersLoading: boolean;
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
  name: string;
  contact: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  colors: string[];
  sizes: string[];
}
