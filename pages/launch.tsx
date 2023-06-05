import NextButton from "@/components/Launch/modules/NextButton";
import SwitchLaunch from "@/components/Launch/modules/SwitchLaunch";
import { setLaunchPageCount } from "@/redux/reducers/launchPageCountSlice";
import { RootState } from "@/redux/store";
import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";

const Launch: NextPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const page = useSelector(
    (state: RootState) => state.app.launchPageCountReducer.value
  );
  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );

  return (
    <div className="relative w-full h-screen flex flex-col z-1">
      <SwitchLaunch profile={profile} page={page} />
      <div className="flex flex-row gap-3 justify-end items-center h-fit w-full p-3">
        {page > 0 && (
          <NextButton
            text={"BACK"}
            setPage={() =>
              dispatch(setLaunchPageCount(page > 0 ? page - 1 : 0))
            }
          />
        )}
        <NextButton
          text={"NEXT"}
          setPage={() => dispatch(setLaunchPageCount(page < 5 ? page + 1 : 5))}
        />
      </div>
    </div>
  );
};

export default Launch;
