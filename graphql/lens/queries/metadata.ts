import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  ValidatePublicationMetadataDocument,
  ValidatePublicationMetadataQuery,
  ValidatePublicationMetadataRequest,
} from "../../generated";

const validateMetadata = async (
  request: ValidatePublicationMetadataRequest
): Promise<FetchResult<ValidatePublicationMetadataQuery>> => {
  return await authClient.query({
    query: ValidatePublicationMetadataDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default validateMetadata;
