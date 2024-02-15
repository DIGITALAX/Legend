import { gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";
import serializeQuery from "../../../lib/lens/helpers/serializeQuery";

const COLLECTIONS = `
  query {
    collectionCreateds(where: {origin: "0"}, first: 1000) {
      fulfiller
      unlimited
      printType
      prices
      owner
      collectionId
      collectionMetadata {
        sizes
        colors
        images
        title
      }
      amount
      uri
      acceptedTokens
      designerPercent
      fulfillerBase
      fulfillerPercent
    }
  }
`;

const COLLECTIONS_PAGINATED = `
  query($first: Int, $skip: Int) {
    collectionCreateds(where: {origin: "0"}, first: $first, skip: $skip) {
      printType
      prices
      owner
      collectionId
      collectionMetadata {
        sizes
        colors
        images
        title
      }
      uri
      pubId
      profileId
      blockTimestamp
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

export const getCollections = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS_PAGINATED),
    variables: {
      first,
      skip,
    },
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


export const getCollectionsFilter = async (
  first: number,
  skip: number,
  where: Object
): Promise<any> => {
  const queryPromise = graphPrintClient.query({
    query: gql(`
    query($first: Int, $skip: Int) {
      collectionCreateds(where: {${serializeQuery(
        where
      )}}, first: $first, skip: $skip) {
      printType
      prices
      owner
      collectionId
      collectionMetadata {
        sizes
        colors
        images
        title
      }
      uri
      pubId
      profileId
      blockTimestamp
      }
    }
  `),
    variables: {
      first,
      skip,
    },
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
