import { gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const COLLECTIONS = `
  query {
    collectionCreateds(where: {origin: "0"}) {
      fulfiller
      unlimited
      printType
      prices
      collectionId
      designerSplit
      fulfillerBase
      fulfillerSplit
      collectionMetadata {
        sizes
        colors
        images
        title
      }
      amount
    }
  }
`;

export const getAllCollections = async (): Promise<any> => {
  const queryPromise =  graphPrintClient.query({
    query: gql(COLLECTIONS),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
