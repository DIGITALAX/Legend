import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Error from "./modules/Error";
import MediaExpand from "./modules/MediaExpand";
import ClaimProfile from "./modules/ClaimProfile";
import Index from "./modules/Index";

const Modals: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const errorModal = useSelector(
    (state: RootState) => state.app.errorModalReducer
  );
  const imageExpandModal = useSelector(
    (state: RootState) => state.app.imageExpandReducer
  );
  const claimProfile = useSelector(
    (state: RootState) => state.app.claimProfileReducer
  );
  const indexer = useSelector((state: RootState) => state.app.indexerReducer);
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
      {claimProfile?.value && <ClaimProfile dispatch={dispatch} />}
      {indexer?.open && <Index message={indexer?.message!} />}
    </>
  );
};

export default Modals;
