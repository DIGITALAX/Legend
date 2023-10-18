import useGrants from "@/components/Grants/hooks/useGrants";
import Grant from "@/components/Grants/modules/Grant";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRouter } from "next/router";
import LikeBox from "@/components/Grants/modules/LikeBox";
import MirrorBox from "@/components/Grants/modules/MirrorBox";
import CommentBox from "@/components/Grants/modules/CommentBox";
import { Post } from "../../graphql/generated";
import useInteractions from "@/components/Grants/hooks/useInteractions";

export default function Home() {
  const {
    imageIndex,
    setImageIndex,
    setCollectChoice,
    handleFetchMoreGrants,
    collectChoice,
  } = useGrants();
  const {
    commentGrant,
    mirrorGrant,
    likeGrant,
    quoteGrant,
    showComments,
    showLikes,
    showMirrors,
    showQuotes,
    showMoreComments,
    showMoreLikes,
    showMoreMirrors,
    showMoreQuotes,
    interactionsLoading,
    grantComment,
    setGrantComment,
    grantQuote,
    setGrantQuote,
  } = useInteractions();
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const reactBox = useSelector((state: RootState) => state.app.reactBoxReducer);
  const allPublications = useSelector(
    (state: RootState) => state.app.publishedGrantsReducer.items
  );
  const apparelItems = useSelector(
    (state: RootState) => state.app.publishedGrantsReducer.apparel
  );
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-start p-2 overflow-auto flex-grow"
      id="milestone"
    >
      {reactBox?.comment?.id !== "" && (
        <CommentBox
          showMoreComments={showMoreComments}
          comments={reactBox?.comment?.profiles}
          grantComment={grantComment}
          setGrantComment={setGrantComment}
        />
      )}
      {(reactBox?.mirror?.id !== "" || reactBox?.quote?.id !== "") && (
        <MirrorBox
          showMoreMirrors={showMoreMirrors}
          showMoreQuotes={showMoreQuotes}
          mirrors={reactBox?.mirror?.profiles}
          quotes={reactBox?.quote?.profiles}
          grantQuote={grantQuote}
          setGrantQuote={setGrantQuote}
        />
      )}
      {reactBox?.like?.id !== "" && (
        <LikeBox
          showMoreLikes={showMoreLikes}
          likes={reactBox?.like?.profiles}
        />
      )}
      <InfiniteScroll
        dataLength={allPublications.length}
        loader={<></>}
        hasMore={true}
        next={handleFetchMoreGrants}
        className={`w-full h-full items-start justify-center`}
      >
        {allPublications?.map((publication: Post, index: number) => {
          return (
            <Grant
              key={index}
              imageIndex={imageIndex}
              setImageIndex={setImageIndex}
              index={0}
              publication={publication}
              collectChoice={collectChoice}
              commentGrant={commentGrant}
              likeGrant={likeGrant}
              mirrorGrant={mirrorGrant}
              quoteGrant={quoteGrant}
              setCollectChoice={setCollectChoice}
              cartItems={cartItems}
              dispatch={dispatch}
              router={router}
              showComments={showComments}
              showLikes={showLikes}
              showMirrors={showMirrors}
              showQuotes={showQuotes}
              interactionsLoading={interactionsLoading[index]}
              apparelItems={apparelItems?.[index]}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
}
