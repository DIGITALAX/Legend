import { Action, Dispatch } from "redux";
import likePost from "../../../graphql/lens/mutations/like";
import { PublicationReactionType } from "../../../graphql/generated";
import handleIndexCheck from "../../graph/helpers/handleIndexCheck";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
const lensLike = async (
  id: string,
  dispatch: Dispatch<Action>,
  downvote: boolean
): Promise<void> => {
  const data = await likePost({
    for: id,
    reaction: downvote
      ? PublicationReactionType.Downvote
      : PublicationReactionType.Upvote,
  });

  if (
    data?.data?.addReaction?.__typename === "RelaySuccess" ||
    !data?.data?.addReaction
  ) {
    if (data?.data?.addReaction?.txId) {
      await handleIndexCheck(
        {
          forTxId: data?.data?.addReaction?.txId,
        },
        dispatch
      );
    } else {
      dispatch(
        setIndexer({
          actionOpen: true,
          actionMessage: "Successfully Indexed",
        })
      );
      setTimeout(() => {
        dispatch(
          setIndexer({
            actionOpen: false,
            actionMessage: undefined,
          })
        );
      }, 1000);
    }
  }
};

export default lensLike;
