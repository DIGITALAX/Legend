import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import { EncryptedDetails, Order } from "../types/grantee.types";
import { getGrantOrders } from "../../../../graphql/subgraph/queries/getGrantOrders";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";
import { Grant } from "@/components/Grants/types/grant.types";
import {
  LitNodeClient,
  checkAndSignAuthMessage,
  decryptToString,
} from "@lit-protocol/lit-node-client";

const useOrders = (
  address: `0x${string}` | undefined,
  lensConnected: Profile | undefined,
  client: LitNodeClient,
  orders: boolean
) => {
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [orderOpen, setOrderOpen] = useState<boolean[]>([]);
  const [orderDecrypting, setOrderDecrypting] = useState<boolean[]>([]);

  const handleOrders = async () => {
    if (!address || !lensConnected?.id) return;
    setOrdersLoading(true);
    try {
      const data = await getGrantOrders(address);

      if (data?.data && data?.data?.grantOrders?.length > 0) {
        const orders = await Promise.all(
          data?.data?.grantOrders?.map(
            async (item: {
              grant: Grant;
              orderCollections: {
                collectionMetadata: {
                  colors: string;
                  sizes: string;
                };
              }[];
            }) => {
              if (!item?.grant?.grantMetadata) {
                const grantMetadata = await fetchIpfsJson(item?.grant?.uri);
                item = {
                  ...item,
                  grant: {
                    ...item?.grant,
                    grantMetadata,
                  },
                };
              }

              return {
                ...item,
                orderCollections: item?.orderCollections?.map((o) => ({
                  ...o,
                  collectionMetadata: {
                    ...o?.collectionMetadata,
                    sizes: o?.collectionMetadata?.sizes
                      ?.split(",")
                      .map((word: string) => word?.trim())
                      .filter((word: string) => word.length > 0),
                    colors: o?.collectionMetadata?.colors
                      ?.split(",")
                      .map((word: string) => word?.trim())
                      .filter((word: string) => word.length > 0),
                  },
                })),
              };
            }
          )
        );
        setAllOrders(orders);

        setOrderDecrypting(Array.from({ length: orders.length }, () => false));
        setOrderOpen(Array.from({ length: orders.length }, () => false));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setOrdersLoading(false);
  };

  const decryptOrder = async (order: Order) => {
    const index = allOrders.findIndex((item) => item.orderId == order.orderId);

    try {
      if (
        (order?.encryptedFulfillment as EncryptedDetails)?.ciphertext ||
        (order?.encryptedFulfillment as EncryptedDetails)?.dataToEncryptHash ||
        !address ||
        order?.decrypted
      ) {
        return;
      }

      setOrderDecrypting((prev) => {
        const arr = [...prev];
        arr[index] = true;
        return arr;
      });

      let nonce = client.getLatestBlockhash();

      const authSig = await checkAndSignAuthMessage({
        chain: "mumbai",
        nonce: nonce!,
      });
      await client.connect();

      const data = await fetchIpfsJson(order?.encryptedFulfillment as string);

      const decryptedString = await decryptToString(
        {
          authSig,
          accessControlConditions: (data as EncryptedDetails)
            .accessControlConditions,
          ciphertext: (data as EncryptedDetails).ciphertext,
          dataToEncryptHash: (data as EncryptedDetails).dataToEncryptHash,
          chain: "mumbai",
        },
        client! as any
      );

      const details = await JSON.parse(decryptedString);

      setAllOrders((prev) => {
        const orders = [...prev];
        orders[index] = {
          ...orders[index],
          encryptedFulfillment: details,
          decrypted: true,
        };
        return orders;
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setOrderDecrypting((prev) => {
      const arr = [...prev];
      arr[index] = false;
      return arr;
    });
  };

  useEffect(() => {
    if (allOrders?.length < 1) {
      handleOrders();
    }
  }, [orders]);

  return {
    ordersLoading,
    allOrders,
    orderOpen,
    setOrderOpen,
    decryptOrder,
    orderDecrypting,
  };
};

export default useOrders;
