import { gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const GRANTS = `
  query {
    collectionMinteds {
      basePrices
      uri
      collectionId
      amount
      acceptedTokens
      name
      owner
      blockTimestamp
      tokenIds
      soldTokens
    }
  }
`;

export const getAllGrants = async (): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(GRANTS),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 20000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getGrantDetails = async (): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(GRANTS),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 20000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

