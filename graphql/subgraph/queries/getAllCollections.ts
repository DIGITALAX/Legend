import { gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const COLLECTIONS = `
  query {
    collectionCreateds(where: {unlimited: true, printType_not: "4"}) {
      fulfiller
      uri
      unlimited
      printType
      prices
      fulfillerPercent
      fulfillerBase
      designerPercent
      collectionId
      amount
    }
  }
`;

export const getAllCollections = async (): Promise<any> => {
  const queryPromise = graphPrintClient.query({
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
