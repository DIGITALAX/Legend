import { Action, Dispatch } from "redux";
import getProfile from "../../../graphql/lens/queries/profile";
import { setLensConnected } from "../../../redux/reducers/lensProfileSlice";
import { Profile } from "../../../graphql/generated";


const refetchProfile = async (
  dispatch: Dispatch<Action>,
  id: string,
  connected: boolean
) => {
  try {
    const { data } = await getProfile(
      {
        forProfileId: id,
      },
      connected
    );

    dispatch(setLensConnected(data?.profile as Profile));
  } catch (err: any) {
    console.error(err.message);
  }
};

export default refetchProfile;
