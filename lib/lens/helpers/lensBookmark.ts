import { Action, Dispatch } from "redux";
import handleIndexCheck from "../../graph/helpers/handleIndexCheck";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import bookmark from "../../../graphql/lens/mutations/bookmark";

const lensBookmark = async (on: string, dispatch: Dispatch<Action>) => {
  try {
    const { data } = await bookmark({
      on,
    });
    if (
      data?.addPublicationBookmark?.__typename === "RelaySuccess" ||
      !data?.addPublicationBookmark
    ) {
      if (data?.addPublicationBookmark?.txId) {
        await handleIndexCheck(
          {
            forTxId: data?.addPublicationBookmark?.txId,
          },
          dispatch
        );
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Quest Saved",
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
  } catch (err: any) {
    console.error(err.message);
  }
};

export default lensBookmark;
