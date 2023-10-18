import Grant from "@/components/Account/modules/Grant";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Orders from "@/components/Account/modules/Orders";

export default function Account() {
  const publishedGrants = useSelector(
    (state: RootState) => state.app.publishedGrantsReducer.items
  );
  const grantee = useSelector(
    (state: RootState) => state.app.granteeReducer.value
  );
  return (
    <div className="relative w-full h-full flex flex-row items-start justify-start p-5 gap-10">
      {grantee && (
        <InfiniteScroll
          dataLength={14}
          loader={<></>}
          hasMore={true}
          next={() => {}}
          className={`w-full h-full grid grid-cols-5 gap-4`}
        >
          {publishedGrants?.map((grant, index: number) => {
            return <Grant key={index} grant={grant} />;
          })}
        </InfiniteScroll>
      )}
      <Orders />
    </div>
  );
}
