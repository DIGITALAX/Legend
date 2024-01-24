import { Action, Dispatch } from "redux";
import { setIndexer } from "../../../redux/reducers/indexerSlice";
import { setErrorModal } from "../../../redux/reducers/errorModalSlice";

const errorChoice = async (
  err: any,
  runner: (() => Promise<void>) | (() => void),
  dispatch: Dispatch<Action>
) => {
  if (err?.message?.includes("User rejected the request")) return;
  if (
    !err?.messages?.includes("Block at number") &&
    !err?.message?.includes("could not be found")
  ) {
    dispatch(
      setErrorModal({
        actionValue: true,
        actionMessage:
          "Something went wrong indexing your interaction. Try again?",
      })
    );
    console.error(err.message);
  } else {
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: "Successfully Indexed",
      })
    );

    if (runner() instanceof Promise) {
      await runner();
    } else {
      runner();
    }

    setTimeout(() => {
      dispatch(
        setIndexer({
          actionOpen: false,
          actionMessage: undefined,
        })
      );
    }, 3000);
  }
};

export default errorChoice;
