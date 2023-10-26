import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  ValidatePublicationMetadataDocument,
  ValidatePublicationMetadataQuery,
  ValidatePublicationMetadataRequest,
} from "../../generated";

const validateMetadata = (
  request: ValidatePublicationMetadataRequest
): Promise<FetchResult<ValidatePublicationMetadataQuery>> => {
  return authClient.query({
    query: ValidatePublicationMetadataDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default validateMetadata;
