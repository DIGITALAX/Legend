import { FunctionComponent } from "react";
import { OrdersProps } from "../types/grantee.types";
import Bar from "@/components/Common/modules/Bar";

const Orders: FunctionComponent<OrdersProps> = ({
  allOrders,
  ordersLoading,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-full flex items-start justify-start flex-col overflow-y-scroll"
      id="side"
    >
      {ordersLoading ? (
        <div className="relative w-full h-fit flex flex-col items-center justify-start gap-8">
          {Array.from({ length: 3 })?.map((_, index: number) => {
            return (
              <div
                className="relative h-40 w-3/4 border border-black flex flex-col items-center justify-start bg-black animate-pulse"
                key={index}
              >
                <Bar title={"Loading..."} />
                <div className="relative w-full h-full flex flex-col bg-grant bg-repeat bg-contain"></div>
              </div>
            );
          })}
        </div>
      ) : allOrders?.length < 1 ? (
        <div className="relative w-full h-full flex items-center justify-center text-xxs font-dog text-white">
          <div className="relative w-fit h-fit items-center justify-center">
            No Orders Yet.
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Orders;
