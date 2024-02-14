import { FetchResult } from "@apollo/client";
import { apolloClient, authClient } from "../../../lib/lens/client";
import {
  ProfilesDocument,
  ProfilesQuery,
  ProfilesRequest,
} from "../../generated";

const getProfiles = async (
  request: ProfilesRequest,
  connected: boolean
): Promise<FetchResult<ProfilesQuery>> => {
  return await (connected ? apolloClient : authClient).query({
    query: ProfilesDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default getProfiles;
