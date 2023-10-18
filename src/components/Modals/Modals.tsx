import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Error from "./modules/Error";
import MediaExpand from "./modules/MediaExpand";

const Modals: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const errorModal = useSelector(
    (state: RootState) => state.app.errorModalReducer
  );
  const imageExpandModal = useSelector(
    (state: RootState) => state.app.imageExpandReducer
  );
  return (
    <>
      {errorModal.value && (
        <Error message={errorModal.message} dispatch={dispatch} />
      )}
      {imageExpandModal.value && (
        <MediaExpand
          type={imageExpandModal.type}
          image={imageExpandModal.media}
          dispatch={dispatch}
        />
      )}
    </>
  );
};

export default Modals;
