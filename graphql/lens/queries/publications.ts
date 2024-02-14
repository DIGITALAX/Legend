import { FetchResult } from "@apollo/client";
import { apolloClient, authClient } from "../../../lib/lens/client";
import {
  PublicationsDocument,
  PublicationsQuery,
  PublicationsRequest,
} from "../../generated";

const getPublications = async (
  request: PublicationsRequest,
  connected: boolean
): Promise<FetchResult<PublicationsQuery>> => {
  return await (connected ? apolloClient : authClient).query({
    query: PublicationsDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default getPublications;
