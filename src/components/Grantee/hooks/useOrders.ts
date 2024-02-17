import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import { Order } from "../types/grantee.types";
import { getGrantOrders } from "../../../../graphql/subgraph/queries/getGrantOrders";
import fetchIpfsJson from "../../../../lib/graph/helpers/fetchIPFSJson";
import { Grant } from "@/components/Grants/types/grant.types";

const useOrders = (
  address: `0x${string}` | undefined,
  lensConnected: Profile | undefined
) => {
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  const handleOrders = async () => {
    if (!address || !lensConnected?.id) return;
    setOrdersLoading(true);

    const { data } = await getGrantOrders(address);

    if (data?.data && data?.data?.grantOrders?.length > 0) {
      const orders = await Promise.all(
        data?.data?.grantOrders?.map(async (item: { grant: Grant }) => {
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

          return item;
        })
      );
      setAllOrders(orders);
    }

    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setOrdersLoading(false);
  };

  useEffect(() => {
    if (allOrders?.length < 1) {
      handleOrders();
    }
  }, []);

  return {
    ordersLoading,
    allOrders,
  };
};

export default useOrders;
