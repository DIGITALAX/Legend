import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../lib/lens/client";
import { RefreshDocument, RefreshMutation, RefreshRequest } from "../generated";

const refresh = async (
  request: RefreshRequest
): Promise<FetchResult<RefreshMutation>> => {
  return apolloClient.mutate({
    mutation: RefreshDocument,
    variables: {
      request: request,
    },
  });
};

export default refresh;
