import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../lib/lens/client";
import {
  OnchainPostRequest,
  PostOnchainDocument,
  PostOnchainMutation,
} from "../generated";

const onChainPost = async (
  request: OnchainPostRequest
): Promise<FetchResult<PostOnchainMutation>> => {
  return apolloClient.mutate({
    mutation: PostOnchainDocument,
    variables: {
      request: request,
    },
  });
};

export default onChainPost;
