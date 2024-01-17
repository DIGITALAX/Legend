import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  ChangeProfileManagersRequest,
  CreateChangeProfileManagersTypedDataDocument,
  CreateChangeProfileManagersTypedDataMutation,
} from "../../generated";

const profileManager = async (
  request: ChangeProfileManagersRequest
): Promise<FetchResult<CreateChangeProfileManagersTypedDataMutation>> => {
  return await apolloClient.mutate({
    mutation: CreateChangeProfileManagersTypedDataDocument,
    variables: {
      request: request,
    },
  });
};

export default profileManager;
